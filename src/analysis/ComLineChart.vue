<template>
  <div class="com_linechart" ref="com_linechart"></div>
</template>

<script>
  import axios from '../store/axios'
  import common from '../store/common'

  export default {
    name: "ComLineChart",
    data() {
      return {
        lineChart: null,
        lineChartData: {},
        referenceMap: {
          filelen: '流量',
          connect: '访问量'
        },
        unitsMap: {
          filelen: '(GB)',
          connect: '(次)'
        },
        titleText: '主机%s关系图',
        titleSubtext: 'ip0: %s0  ip1: %s1',
        option: {
          color: ['rgba(194,53,49,0.6)', 'rgba(255,153,51,0.8)'],
          title: {
            text: '',
            subtext: '',
            x: 'center',
            top: '20',
            right: '10',
            textStyle: {
              color: '#fff'
            }
          },
          dataZoom: [
            {
              type:'inside'
            }, {
              type: 'slider',
              show:false
            }
          ],
          calculable: true,
          toolbox: {
            show: true,
            orient: 'horizontal',
            x: 'right',
            y: 'top',
            color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e'],
            backgroundColor: 'rgba(0,0,0,0)', // 工具箱背景颜色
            borderColor: '#ccc',       // 工具箱边框颜色
            borderWidth: 0,            // 工具箱边框线宽，单位px，默认为0（无边框）
            padding: 5,                // 工具箱内边距，单位px，默认各方向内边距为5，
            showTitle: true,
            feature: {
              myTool2: {
                show: false,
                title: '端口详情',
                icon: 'path://M893.7,217.9L767.5,91.8c-14.6-14.6-38.4-14.6-53,0c-14.6,14.6-14.6,38.4,0,53l62.1,62.1H262.2C123.1,206.9,10,320,10,459.1v131.7c0,20.7,16.8,37.5,37.5,37.5c20.7,0,37.5-16.8,37.5-37.5V459.1c0-97.7,79.5-177.2,177.2-177.2h514.5l-54.4,54.4c-14.6,14.6-14.6,38.4,0,53c7.3,7.3,16.9,11,26.5,11c9.6,0,19.2-3.7,26.5-11l118.4-118.4C908.3,256.3,908.3,232.5,893.7,217.9z"/><path d="M217.9,637.2"/><path d="M952.5,371.8c-20.7,0-37.5,16.8-37.5,37.5v131.7c0,97.7-79.5,177.2-177.2,177.2H223.4l54.4-54.4c14.6-14.6,14.6-38.4,0-53c-14.6-14.6-38.4-14.6-53,0L106.3,729.1c-14.6,14.6-14.6,38.4,0,53l126.1,126.1c7.3,7.3,16.9,11,26.5,11c9.6,0,19.2-3.7,26.5-11c14.6-14.6,14.6-38.4,0-53l-62.1-62.1h514.5c139,0,252.2-113.1,252.2-252.2V409.3C990,388.6,973.2,371.8,952.5,371.8z',
                onclick: undefined
              },
              myTool1: {
                show: true,
                title: '',
                icon: 'path://M893.7,217.9L767.5,91.8c-14.6-14.6-38.4-14.6-53,0c-14.6,14.6-14.6,38.4,0,53l62.1,62.1H262.2C123.1,206.9,10,320,10,459.1v131.7c0,20.7,16.8,37.5,37.5,37.5c20.7,0,37.5-16.8,37.5-37.5V459.1c0-97.7,79.5-177.2,177.2-177.2h514.5l-54.4,54.4c-14.6,14.6-14.6,38.4,0,53c7.3,7.3,16.9,11,26.5,11c9.6,0,19.2-3.7,26.5-11l118.4-118.4C908.3,256.3,908.3,232.5,893.7,217.9z"/><path d="M217.9,637.2"/><path d="M952.5,371.8c-20.7,0-37.5,16.8-37.5,37.5v131.7c0,97.7-79.5,177.2-177.2,177.2H223.4l54.4-54.4c14.6-14.6,14.6-38.4,0-53c-14.6-14.6-38.4-14.6-53,0L106.3,729.1c-14.6,14.6-14.6,38.4,0,53l126.1,126.1c7.3,7.3,16.9,11,26.5,11c9.6,0,19.2-3.7,26.5-11c14.6-14.6,14.6-38.4,0-53l-62.1-62.1h514.5c139,0,252.2-113.1,252.2-252.2V409.3C990,388.6,973.2,371.8,952.5,371.8z',
                onclick: undefined
              },
              myTool: {
                show: true,
                title: '移除',
                icon: 'path://M298.1,4933.4c-49-46-76.6-107.3-76.6-171.6c0-82.7,64.4-162.4,484.2-591.4c1857-1890.8,3928.6-4035.8,3928.6-4063.4c0-27.6-2414.8-2525.1-3959.2-4094.1c-386.1-392.3-453.5-475-453.5-554.7c0-208.4,214.5-312.6,389.2-186.9c55.2,39.8,1060.3,1060.3,2234,2270.7C4021.3-1250.6,4989.7-260.8,5002-260.8S6004-1272.1,7205.3-2504c1201.2-1235,2215.6-2258.5,2255.4-2273.8c165.5-64.3,367.7,137.9,303.4,303.4c-15.3,39.8-1011.3,1078.7-2209.5,2310.6C6353.3-931.9,5369.7,91.6,5369.7,110c0,24.5,2016.4,2111.4,3931.6,4066.5c487.3,493.4,490.3,496.4,471.9,612.9c-24.5,137.9-116.4,220.6-248.2,220.6c-79.7,0-137.9-42.9-370.8-288.1C8372.8,3903.7,5020.3,474.7,5002,474.7S1554.5,3983.4,849.7,4721.9c-239,251.3-288.1,288.1-376.9,288.1C405.3,5010,347.1,4985.5,298.1,4933.4z',
                onclick: undefined
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          legend: {
            data: [],
            x: 'left',
            textStyle: {
              color: '#fff'
            }
          },
          axisPointer: {
            link: {xAxisIndex: 'all'}
          },
          grid: {
            left: '3%',
            right: '10%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              onZero: true,
              lineStyle: {
                color: 'rgba(233,233,233,0.8)'
              }
            },
            axisLabel: {
              color: 'rgba(233,233,233,0.8)',
              show: false
            },
            data: [],
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: 'rgba(233,233,233,0.8)'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(233,233,233,0.8)'
              }
            },
            name: '',
            nameTextStyle: {
              paddingRight: 10
            },
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '',
              type: 'line',
              symbolSize: 8,
              hoverAnimation: false,
              data: []
            },
            {
              name: '',
              type: 'line',
              symbolSize: 8,
              hoverAnimation: false,
              data: [],
            }
          ]
        },
        zoomStart: '',
        zoomEnd: ''
      }
    },
    props: ['param', 'width', 'height'],

    mounted() {
      this.$refs.com_linechart.style.width = this.width;
      this.$refs.com_linechart.style.height = this.height;
      this.lineChart = this.$echarts.init(this.$refs.com_linechart);
      this.$refs.com_linechart.style.marginTop = '10px';
      this.option.toolbox.feature.myTool.onclick = () => {
        this.$emit('onclose', this.param)
      };
      if(this.param.dataType === 'node'){
        this.option.toolbox.feature.myTool2.show = true;
        this.option.toolbox.feature.myTool2.onclick = this.doDrawPortChart;
      }
      this.lineChart.on('click', this.doLineClick);
      this.lineChart.on('dataZoom', this.doZoomDataChange);
      this.option.toolbox.feature.myTool1.onclick = this.doMyTool1;
      this.option.toolbox.feature.myTool1.title = this.param.lineChartType === '统计值' ? '转换为离散值' : '转换为统计值';
      let condition = {
        granularity: this.param.granularity,
        reference: this.param.reference,
        start: this.param.start,
        end: this.param.end
      };
      if (this.param.dataType === 'edge') {
        condition.ip0 = this.param.ips[0];
        condition.ip1 = this.param.ips[1];
      } else if (this.param.dataType === 'node') {
        condition.ip = this.param.ips[0];
      }
      this.zoomStart = this.param.start;
      this.zoomEnd = this.param.end;
      this.getLineChartData(condition).then(() => {
        if (this.param.lineChartType === '叠加值') {
          this.drawLineChartMerge()
        } else {
          this.drawLineChartSplit()
        }
      })
    },
    methods: {
      doDrawPortChart(){
        let obj = {type: 'port'};
        for(let key in this.param){
          obj[key] = this.param[key]
        }
        obj.start = this.zoomStart;
        obj.end = this.zoomEnd;
        this.$emit('ondraw', obj)
      },
      doZoomDataChange(params){
        let start, end;
        if(params.hasOwnProperty('batch')){
          start = params.batch[0].start;
          end = params.batch[0].end
        }else{
          start = params.start;
          end = params.end;
        }
        let startIndex = Math.round(this.lineChartData.time.length * (start / 100));
        this.zoomStart = this.lineChartData.time[startIndex];
        let endIndex = Math.round(this.lineChartData.time.length * (end / 100)) - 1;
        this.zoomEnd = this.lineChartData.time[endIndex];
      },
      doLineClick(param){
        if(param.componentSubType === "line" && param.componentType === "series"){
          if(this.param.dataType === 'edge') {
            let ips = param.seriesName.replace(/ip/g, '').split('>');
            this.$emit('ondraw', {
              type: 'access',
              srcip: this.param.ips[Number(ips[0])],
              dstip: this.param.ips[Number(ips[1])],
              start: this.zoomStart,
              end: this.zoomEnd
            });
          }else if(this.param.dataType === 'node'){
            if(param.seriesName === '访问量' || param.seriesName === '发送流量'){
              this.$emit('ondraw', {
                type: 'access',
                srcip: this.param.ips[0],
                dstip: 'all',
                start: this.zoomStart,
                end: this.zoomEnd
              });
            }else{
              this.$emit('ondraw', {
                type: 'access',
                srcip: 'all',
                dstip: this.param.ips[0],
                start: this.zoomStart,
                end: this.zoomEnd
              });
            }
          }
        }
      },
      doMyTool1() {
        if (this.param.lineChartType === '叠加值') {
          this.option.toolbox.feature.myTool1.title = '转换为叠加值';
          this.param.lineChartType = '离散值';
          this.drawLineChartSplit()
        } else {
          this.option.toolbox.feature.myTool1.title = '转换为离散值';
          this.param.lineChartType = '叠加值';
          this.drawLineChartMerge()
        }
      },
      getLineChartData(form) {
        if (this.param.dataType === 'edge') {
          return new Promise((resolve, reject) => {
            axios.get('/api/flows/between/' + common.convertParams(form)).then(({data}) => {
              this.lineChartData = data.data;
              resolve();
            }).catch((err) => {
              reject(err);
            })
          })
        }
        else if (this.param.dataType === 'node') {
          return new Promise((resolve, reject) => {
            axios.get('/api/flows/host/' + common.convertParams(form)).then(({data}) => {
              this.lineChartData = data.data;
              resolve();
            }).catch((err) => {
              reject(err);
            })
          })
        }
      },
      drawLineChartSplit() {
        if (this.param.dataType === 'edge') {
          let ip0 = this.param.ips[0];
          let ip1 = this.param.ips[1];
          let reference = this.param.reference;
          this.option.title.subtext = this.titleSubtext.replace('%s0', ip0).replace('%s1', ip1);
          this.option.legend.data = ['ip0 > ip1', 'ip1 > ip0'];
          this.option.xAxis.data = this.lineChartData.time.map((item) => {
            let dates = item.split(' ')[0].split('-');
            let res = dates[1] + '/' + dates[2];
            if(this.param.granularity === 'hours')
              res += (' ' + item.split(' ')[1].split(':')[0] + '点');
            return res
          });
          let scale = reference === 'filelen' ? 1024 * 1024 : 1;
          this.option.series[0].data = this.lineChartData.ip0.map((item) => {
            return item / scale
          });
          this.option.series[0].name = 'ip0 > ip1';
          this.option.series[1].data = this.lineChartData.ip1.map((item) => {
            return item / scale
          });
          this.option.series[1].name = 'ip1 > ip0';
          this.option.yAxis.name = this.referenceMap[reference] + this.unitsMap[reference];
          this.lineChart.setOption(this.option)
        } else if (this.param.dataType === 'node') {
          let ip = this.param.ips[0];
          let reference = this.param.reference;
          this.option.title.subtext = 'ip: ' + ip;
          this.option.legend.data = reference === 'filelen' ? ['发送流量', '接收流量'] : ['访问量', '被访问量'];
          this.option.xAxis.data = this.lineChartData.time.map((item) => {
            let dates = item.split(' ')[0].split('-');
            let res = dates[1] + '/' + dates[2];
            if(this.param.granularity === 'hours')
              res += (' ' + item.split(' ')[1].split(':')[0] + '点');
            return res
          });
          let scale = reference === 'filelen' ? 1024 * 1024 : 1;
          this.option.series[0].data = this.lineChartData.send.map((item) => {
            return item / scale
          });
          this.option.series[0].name = this.option.legend.data[0];
          this.option.series[1].data = this.lineChartData.recv.map((item) => {
            return item / scale
          });
          this.option.series[1].name = this.option.legend.data[1];
          this.option.yAxis.name = this.referenceMap[reference] + this.unitsMap[reference];
          this.lineChart.setOption(this.option)
        }
      },
      drawLineChartMerge() {
        if (this.param.dataType === 'edge') {
          let ip0 = this.param.ips[0];
          let ip1 = this.param.ips[1];
          let reference = this.param.reference;
          this.option.title.subtext = this.titleSubtext.replace('%s0', ip0).replace('%s1', ip1);
          this.option.legend.data = ['ip0 > ip1', 'ip1 > ip0'];
          this.option.xAxis.data = this.lineChartData.time.map((item) => {
            let dates = item.split(' ')[0].split('-');
            let res = dates[1] + '/' + dates[2];
            if(this.param.granularity === 'hours')
              res += (' ' + item.split(' ')[1].split(':')[0] + '点');
            return res
          });
          let scale = reference === 'filelen' ? 1024 * 1024 : 1;
          let sum = 0;
          this.option.series[0].data = this.lineChartData.ip0.map((item) => {
            sum += item / scale;
            return sum
          });
          this.option.series[0].name = this.option.legend.data[0];
          sum = 0;
          this.option.series[1].data = this.lineChartData.ip1.map((item) => {
            sum += item / scale;
            return sum
          });
          this.option.series[1].name = this.option.legend.data[1];
          this.option.yAxis.name = this.referenceMap[reference] + this.unitsMap[reference];
          this.lineChart.setOption(this.option)
        } else if (this.param.dataType === 'node') {
          let ip = this.param.ips[0];
          let reference = this.param.reference;
          this.option.title.subtext = 'ip: ' + ip;
          this.option.legend.data = reference === 'filelen' ? ['发送流量', '接收流量'] : ['访问量', '被访问量'];
          this.option.xAxis.data = this.lineChartData.time.map((item) => {
            let dates = item.split(' ')[0].split('-');
            let res = dates[1] + '/' + dates[2];
            if(this.param.granularity === 'hours')
              res += (' ' + item.split(' ')[1].split(':')[0] + '点');
            return res
          });
          let scale = reference === 'filelen' ? 1024 * 1024 : 1;
          let sum = 0;
          this.option.series[0].data = this.lineChartData.send.map((item) => {
            sum += item / scale;
            return sum
          });
          this.option.series[0].name = this.option.legend.data[0];
          sum = 0;
          this.option.series[1].data = this.lineChartData.recv.map((item) => {
            sum += item / scale;
            return sum
          });
          this.option.series[1].name = this.option.legend.data[1];
          this.option.yAxis.name = this.referenceMap[reference] + this.unitsMap[reference];
          this.lineChart.setOption(this.option)
        }
      }
    }
  }
</script>
