<template>
  <div style="width: 100%;height: 100%">
    <div class="AxisPannel">
      <el-form :inline="true">
        <el-form-item label="采样间隔">
          <el-input-number size="small" v-model="threshold" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="秒"></el-form-item>
        <el-form-item label="分组项">
          <el-select value="目的端口" v-model="indices.group">
            <el-option label="源IP" :value="1"></el-option>
            <el-option label="源端口" :value="2"></el-option>
            <el-option label="传输层协议" :value="3"></el-option>
            <el-option label="虚拟管道" :value="4"></el-option>
            <el-option label="文件类型" :value="5"></el-option>
            <el-option label="目的端口" :value="7"></el-option>
            <el-option label="目的IP" :value="8"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div ref="comPAxisChart" class="ComPAxisChart"></div>
  </div>
</template>

<script>
  import axios from '../store/axios'
  import common from '../store/common'

  export default {
    name: "ComPAxisChart",
    data() {
      return {
        title: '主机访问详情',
        axisChart: undefined,
        axisChartData: null,
        dataLength: 0,
        threshold: 15,
        indices: {
          group: 7,
          id: 0
        },
        groupCategories: [],
        groupColors: [],
        option: {
          color:['rgba(0,0,0,0)'],
          backgroundColor: 'rgba(0,0,0,0)',
          parallelAxis: [
            {dim: 0, name: '时间', type: 'time'},
            {dim: 1, name: '源IP', type: 'category', data: [], axisLabel: {interval: 0}},
            {dim: 2, name: '源端口', scale: true, max: 65535},
            {dim: 3, name: '传输层协议', type: 'category', data: ['TCP', 'UDP']},
            {dim: 4, name: '虚拟管道', type: 'category', data: []},
            {dim: 5, name: '文件类型', type: 'category', data: []},
            {dim: 6, name: '文件大小',scale: true},
            // {dim: 7, name: '目的端口', type: 'category', data: [], axisLabel: {interval: 0}},
            {dim: 7, name: '目的端口',scale: true, max: 65535},
            {dim: 8, name: '目的IP', type: 'category', data: [],axisLabel: {interval: 0}}
          ],
          visualMap: {
            left: '2%',
            show: true,
            type: 'piecewise',
            categories: [],
            dimension: 0,
            inRange: {
              color: []
            },
            outOfRange: {
              color: ['rgba(255,0,0,1)']
            },
            top: 20,
            textStyle: {
              color: '#fff'
            },
            realtime: false
          },
          animation: true,
          parallel: {
            left: '10%',
            right: '10%',
            bottom: 100,
            axisExpandable:true,
            parallelAxisDefault: {
              type: 'value',
              name: '主机访问详情',
              nameLocation: 'end',
              nameGap: 20,
              nameTextStyle: {
                color: '#fff',
                fontSize: 14
              },
              axisLine: {
                lineStyle: {
                  color: '#aaa'
                }
              },
              axisTick: {
                lineStyle: {
                  color: '#777'
                }
              },
              splitLine: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#fff'
                }
              },
              realtime: false
            }
          },
          series: [{
              name: '正常访问',
              type: 'parallel',
              lineStyle: {
                normal: {
                  width: 0.5,
                  opacity: 0.05
                }
              },
              inactiveOpacity: 0,
              activeOpacity: 0.5,
              // progressive: 500,
              smooth: true,
              data: []
          }]
        }
      }
    },
    computed: {
      changeAxisChartParam(){
        return {
          group: this.indices.group
        }
      },
      paintAxisChartParam(){
        return {
          threshold: this.threshold
        }
      }
    },
    props: {
      param: {
        type: Object,
        required: true
      }
    },
    mounted() {
      this.$emit('title', this.title);
      this.axisChart = this.$echarts.init(this.$refs.comPAxisChart);
      this.drawAxisChart()
    },
    methods: {
      normalizeData(originData) {
        let groupMap = {};
        originData.forEach((row) => {
          let groupName = row[this.indices.group];
          if (!groupMap.hasOwnProperty(groupName)) {
            groupMap[groupName] = 1;
          }
        });
        for (let groupName in groupMap) {
          if (groupMap.hasOwnProperty(groupName)) {
            this.groupCategories.push(groupName);
          }
        }
        let hStep = Math.round(300 / (this.groupCategories.length - 1));
        for (let i = 1; i <= this.groupCategories.length; i++) {
          this.groupColors.push(this.$echarts.color.modifyHSL('#5A94DF', hStep * i));
        }
      },
      drawAxisChart() {
        this.getAxisChartData({
          srcip: this.param.srcip,
          dstip: this.param.dstip,
          start: this.param.start,
          end: this.param.end,
          threshold: this.threshold
        }).then(() => {
          this.paintAxisChart();
        }).catch(err => console.log(err))
      },
      paintAxisChart(){
        this.groupCategories = [];
        this.groupColors = [];
        this.normalizeData(this.axisChartData.normal);
        this.dataLength = this.axisChartData.normal.length;
        this.option.visualMap.categories = this.groupCategories;
        this.option.visualMap.dimension = this.indices.group;
        this.option.visualMap.inRange.color = this.groupColors;
        this.option.parallelAxis[1].data = this.axisChartData['srcips'].sort();
        this.option.parallelAxis[1].axisLabel.interval = Math.floor(this.axisChartData['srcips'].length / 15);
        this.option.parallelAxis[4].data = this.axisChartData['vpis'];
        this.option.parallelAxis[5].data = this.axisChartData['fileaffixes'];
        // this.option.parallelAxis[7].data = this.axisChartData['dstports'].sort((x, y) => {
        //   if (x < y) {
        //     return -1;
        //   } else if (x > y) {
        //     return 1;
        //   } else {
        //     return 0;
        //   }
        // }).map((item => String(item)));
        // this.option.parallelAxis[7].axisLabel.interval = Math.floor(this.axisChartData['dstports'].length / 15);
        this.option.parallelAxis[8].data = this.axisChartData['dstips'].sort();
        this.option.parallelAxis[8].axisLabel.interval = Math.floor(this.axisChartData['dstips'].length / 15);
        this.option.series[0].data = this.axisChartData.normal;
        this.axisChart.setOption(this.option);
      },
      changeAxisChart(){
        this.groupCategories = [];
        this.groupColors = [];
        this.normalizeData(this.axisChartData.normal);
        this.option.visualMap.categories = this.groupCategories;
        this.option.visualMap.dimension = this.indices.group;
        this.option.visualMap.inRange.color = this.groupColors;
        this.axisChart.setOption(this.option);
      },
      getAxisChartData(form) {
        return new Promise((resolve, reject) => {
          axios.get('/api/host/access/' + common.convertParams(form)).then(({data}) => {
            this.axisChartData = data.data;
            resolve();
          }).catch((err) => {
            reject(err);
          })
        })
      }
    },
    watch: {
      title() {
        this.$emit('title', this.title)
      },
      changeAxisChartParam(){
        this.changeAxisChart();
      },
      paintAxisChartParam(){
        this.drawAxisChart();
      }
    }
  }
</script>

<style>
  .ComPAxisChart {
    height: 90%;
    width: 100%;
  }
  .AxisPannel{
    height: 10%;
    margin: 0 auto;
    text-align: center;
  }
</style>
