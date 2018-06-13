<template>
  <div style="height: 100%;width: 100%">
      <div ref="portHostDiv" class="ComPortChart"></div>
      <el-scrollbar ref="portOneScrollbar" class="ComPortOneScrollbar">
        <one-port-chart
          v-if="portHostOneList.length > 0"
          v-for="onePortParam in portHostOneList"
          :param="onePortParam"
          :key="onePortParam.key"
          @onclose="doBarClose"
          width="100%"
          height="150px"/>
        <div v-if="portHostOneList.length <= 0" style="height:80px;width:60%;margin: 100px auto;text-align: center">
          <p style="font-size: 24px"><b>暂无图表!!</b></p><br /><p style="font-size: 18px">请点击左侧节点连接图中的节点或边绘制主机通信折线图</p>
        </div>
      </el-scrollbar>
  </div>
</template>

<script>
  import axios from '../store/axios'
  import common from '../store/common'
  import ComPortLineChart from './ComPortLineChart'

  export default {
    name: "ComPortChart",
    props: {
      param: {
        type: Object,
        required: true
      }
    },
    components: {
      onePortChart: ComPortLineChart
    },
    data() {
      return {
        title: '主机端口使用详情',
        portHostChartData: undefined,
        portHostChart: undefined,
        groupColors: [],
        portHostOneList: [],
        zoomStart: '',
        zoomEnd: '',
        option: {
          color: [],
          title: {
            text: '',
            textStyle: {
              color: '#fff',
            },
            left: 'right',
            top: 'bottom'
          },
          tooltip: {
            position: 'top',
            formatter: function (params) {
              return 'port:' + params.seriesName + ' value:' + params.value;
            }
          },
          dataZoom:[
            {},{
              type:'inside'
            }
          ],
          xAxis: {
            data: [],
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            },
          },
          yAxis: {
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            },
            splitLine: {
              show: false
            }
          },
          series: []
        }
      }
    },
    computed: {},
    mounted() {
      this.$emit('title', this.title);
      this.portHostChart = this.$echarts.init(this.$refs.portHostDiv);
      this.portHostChart.on('click', this.doBarClick);
      this.portHostChart.on('dataZoom', this.doZoomDataChange);
      this.zoomStart = this.param.start;
      this.zoomEnd = this.param.end;
      this.drawPortHostChart();
    },
    methods: {
      doZoomDataChange(params){
        let start, end;
        if(params.hasOwnProperty('batch')){
          start = params.batch[0].start;
          end = params.batch[0].end
        }else{
          start = params.start;
          end = params.end;
        }
        let startIndex = Math.round(this.portHostChartData.time.length * (start / 100));
        this.zoomStart = this.portHostChartData.time[startIndex];
        let endIndex = Math.round(this.portHostChartData.time.length * (end / 100)) - 1;
        this.zoomEnd = this.portHostChartData.time[endIndex];
      },
      doBarClose(param){
        for(let i = 0; i < this.portHostOneList.length; i++){
          if(this.portHostOneList[i].key === param.key){
            this.portHostOneList.splice(i, 1);
            break;
          }
        }
      },
      doBarClick(param){
        let port = param.data.name;
        let granularity = 'hours';
        let start = this.zoomStart;
        let end = this.zoomEnd;
        let reference = param.reference;
        let key = port + start + end + reference;
        this.portHostOneList.forEach(item => {
          if(item.key === key){
            return true;
          }
        });
        this.portHostOneList.push({
          ip: this.param.ips[0],
          port: port,
          granularity:granularity,
          reference: reference,
          start: start,
          end:end
        });
        return true
      },
      getPortHostChartData(form) {
        return new Promise((resolve, reject) => {
          axios.get('/api/port/host' + common.convertParams(form)).then(({data}) => {
            this.portHostChartData = data.data;
            resolve();
          }).catch((err) => {
            reject(err)
          })
        })
      },
      drawPortHostChart() {
        this.getPortHostChartData({
          ip: this.param.ips[0],
          start: this.param.start,
          end: this.param.end,
          granularity: this.param.granularity
        }).then(() => {
          this.option.xAxis.data = this.portHostChartData.time;
          let averages = [];
          let max = Number.MIN_SAFE_INTEGER;
          let portlen = 0;
          this.option.color = this.groupColors;
          for (let port in this.portHostChartData.in) {
            let sum = 0;
            portlen++;
            this.option.series.push({
              type: 'bar',
              stack: 'all',
              tooltop: {
                textStyle: {
                  color: '#fff'
                }
              },
              label: {
                formatter(param){
                  return param.seriesName
                },
                // color: 'rgba(233,233,233,.8)'
                color: '#fff'
              },
              data: this.portHostChartData.in[port].map(item => {
                sum += item;
                let obj = {
                  name: port,
                  value: item,
                  label:{
                    show:false,
                  }
                };
                return obj
              }),
              name: port
            });
            let average = sum / this.portHostChartData.time.length;
            averages.push(average);
            max = Math.max(max, average);
          }
          let hStep = Math.round(300 / (portlen - 1));
          for (let i = 1; i <= portlen + 1; i++) {
            this.groupColors.push(this.$echarts.color.modifyHSL('#5A94DF', hStep * i));
          }
          let excepts = {}, index;
          let step = Math.ceil(max / 100);
          for (let i = 0; i <= 100; i++) {
            excepts[i * step] = 0
          }
          let length = 0;
          averages.forEach(average => {
            if(average <= 100)
              return;
            index = Math.floor(average / 100) * 100;
            for (let key in excepts) {
              if (key > index) {
                excepts[key]++;
                break;
              }
            }
            length++;
          });
          let ME = this.getME(length, excepts);
          // let sum = 0, len = 0;
          // averages.forEach(item => {if(item > 1){ sum += item;len++}});
          // let ME = sum / len;
          // console.log(ME);
          this.option.series.forEach(series => series.data.forEach(item => {
            if(item.value >= ME)
              item.label.show = true;
          }));
          this.portHostChart.setOption(this.option);
        }).catch((err) => {
          console.log(err);
          this.$emit('onerror', err);
        })
      },
      getME(length, pd) {
        let me = 0, scale;
        for (let key in pd) {
          scale = pd[key] / length;
          me += scale * key
        }
        return me
      }
    },
    watch: {
      title() {
        this.$emit('title', this.title)
      }
    }
  }
</script>

<style scoped>
  .ComPortChart {
    height: 90%;
    width: 80%;
    float: left;
  }
  .ComPortOneScrollbar{
    width: 20%;
    height: 580px;
  }
</style>
