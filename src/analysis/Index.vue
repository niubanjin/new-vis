<template>
  <div class="index">
    <div class="row quick-stats">
      <div class="col-lg-7">
        <div class="row">
          <div class="col-sm-6 col-md-4">
            <div class="quick-stats__item">
              <div class="quick-stats__info">
                <h2>{{IPs}}</h2>
                <small>主机数量/台</small>
              </div>
              <div ref="statsChartOne" class="stats__chart"></div>
            </div>
          </div>
          <div class="col-sm-6 col-md-4">
            <div class="quick-stats__item">
              <div class="quick-stats__info">
                <h2>{{Math.round(flows / (1024*1024))}}</h2>
                <small>传输流量/GB</small>
              </div>
              <div ref="statsChartTwo" class="stats__chart"></div>
            </div>
          </div>
          <div class="col-sm-6 col-md-4">
            <div class="quick-stats__item">
              <div class="quick-stats__info">
                <h2>{{connects > 9999999 ? Math.round(connects / 1000) : connects}}</h2>
                <small>请求数量/{{connects > 9999999 ? '千次' : '次'}}</small>
              </div>
              <div ref="statsChartThree" class="stats__chart"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-body">
                <div ref="chartLeft" class="flot-chart"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="card">
          <div class="card-body">
            <div ref="chartRight" class="flot-chart-right"></div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        statsChartOne: null,
        statsChartTwo: null,
        statsChartThree: null,
        leftChart: null,
        rightChart: null,
        filelenFlag: false,
        connectFlag: false,
        IPs: 0,
        flows: 0,
        connects: 0,
        rightGraphParan: {
          granularity: 'days',
          symbol: 'degree',
          threshold: 0,
          cracked: false,
          start: 'start',
          end: 'end',
          leaf: false,
        },
        indices: {
          group: 'name',
          id: 'id'
        },
        groupCategories: [],
        groupColors: [],
      }
    },
    computed: {
      ...mapGetters([
        'statsOneGraph',
        'statsTwoGraph',
        'statsThreeGraph',
        'statsOption',
        'leftGraph',
        'leftOption',
        'rightGraph',
        'rightOption',
      ]),
      rightDrawFlag(){
        return this.filelenFlag && this.connectFlag
      }
    },
    mounted() {
      this.statsChartOne = this.$echarts.init(this.$refs.statsChartOne);
      this.statsChartTwo = this.$echarts.init(this.$refs.statsChartTwo);
      this.statsChartThree = this.$echarts.init(this.$refs.statsChartThree);
      this.leftChart = this.$echarts.init(this.$refs.chartLeft);
      this.rightChart = this.$echarts.init(this.$refs.chartRight, 'light');
      this.initStatsGraph();
      this.initLeftFlotGraph();
      this.initRightFlotGraph();
    },
    methods: {
      ...mapActions([
        'getStatsOneData',
        'getStatsTwoData',
        'getStatsThreeData',
        'getLeftGraphData',
        'getRightGraphData'
      ]),
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
        for (let i = 5; i < this.groupCategories.length + 5; i++) {
          this.groupColors.push(this.$echarts.color.modifyHSL('#5A94DF', hStep * i));
        }
      },
      initStatsGraph(data) {
        this.getStatsOneData({
          ip: 'all',
          granularity: 'days',
          start: 'start',
          end: 'end',
        }).then( () => {
          this.IPs = this.statsOneGraph.ips;
          this.statsOption.xAxis.data = this.statsOneGraph.time;
          // this.statsOption.xAxis.data = this.statsOneGraph.time.slice(
          //   this.statsOneGraph.total.length - 30,
          //   this.statsOneGraph.total.length
          // );
          this.statsOption.series[0].data = this.statsOneGraph.total;
          // this.statsOption.series[0].data = this.statsOneGraph.total.slice(
          //   this.statsOneGraph.total.length - 30,
          //   this.statsOneGraph.total.length
          // );
          this.statsChartOne.setOption(this.statsOption);
        }).catch(err => console.log(err));
        this.getStatsTwoData({
          ip: 'all',
          granularity: 'days',
          start: 'start',
          end: 'end',
          reference: 'filelen',
          type: 'total',
          cracked: false,
        }).then( () => {
          this.statsOption.xAxis.data = this.statsTwoGraph.time;
          // this.statsOption.xAxis.data = this.statsTwoGraph.time.slice(
          //   this.statsTwoGraph.total.length - 30,
          //   this.statsTwoGraph.total.length
          // );
          this.flows = 0;
          this.statsTwoGraph.total.map(item => this.flows+= item);
          this.statsOption.series[0].data = this.statsTwoGraph.total;
          // this.statsOption.series[0].data = this.statsTwoGraph.total.slice(
          //   this.statsTwoGraph.total.length - 30,
          //   this.statsTwoGraph.total.length
          // );
          this.statsChartTwo.setOption(this.statsOption);
        }).catch(err => console.log(err));
        this.getStatsThreeData({
          ip: 'all',
          granularity: 'days',
          start: 'start',
          end: 'end',
          reference: 'connect',
          type: 'total',
          cracked: false,
        }).then( () => {
          this.statsOption.xAxis.data = this.statsThreeGraph.time;
          // this.statsOption.xAxis.data = this.statsThreeGraph.time.slice(
          //   this.statsThreeGraph.total.length - 30,
          //   this.statsThreeGraph.total.length
          // );
          this.connects = 0;
          this.statsThreeGraph.total.map(item => this.connects += item);
          this.statsOption.series[0].data = this.statsThreeGraph.total;
          // this.statsOption.series[0].data = this.statsThreeGraph.total.slice(
          //   this.statsThreeGraph.total.length - 30,
          //   this.statsThreeGraph.total.length
          // );
          this.statsChartThree.setOption(this.statsOption);
        }).catch(err => console.log(err));
      },
      initLeftFlotGraph() {
        this.getLeftGraphData({
          ip: 'all',
          granularity: 'hours',
          start: 'start',
          end: 'end',
          reference: 'filelen',
          type: 'total',
          cracked: false,
        }).then( () => {
          this.leftOption.xAxis[0].data = this.leftGraph.filelen.time;
          let scale = 1024*1024;
          this.leftOption.series[0].data = this.leftGraph.filelen.total.map(item => {
            return Math.round(item / scale)
          });
          this.filelenFlag = true;
        }).catch(err => console.log(err));

        this.getLeftGraphData({
          ip: 'all',
          granularity: 'hours',
          start: 'start',
          end: 'end',
          reference: 'connect',
          type: 'send',
          cracked: false,
        }).then( () => {
          this.leftOption.xAxis[1].data = this.leftGraph.connect.time;
          this.leftOption.series[1].data = this.leftGraph.connect.total;
          this.connectFlag = true;
        }).catch(err => console.log(err));
      },
      initRightFlotGraph() {
        this.getRightGraphData({
          granularity: this.rightGraphParan.granularity,
          symbol: this.rightGraphParan.symbol,
          threshold: this.rightGraphParan.threshold,
          cracked: this.rightGraphParan.cracked,
          start: this.rightGraphParan.start,
          end: this.rightGraphParan.end,
          leaf: this.rightGraphParan.leaf
        }).then( () => {
          this.groupCategories = [];
          this.groupColors = [];
          this.normalizeData(this.rightGraph.nodes);
          this.rightOption.color = this.groupColors;
          this.rightOption.series[0].data = this.rightGraph.nodes;
          this.rightChart.setOption(this.rightOption)
        }).catch(err => console.log(err));
      }
    },
    watch: {
      rightDrawFlag(){
        this.leftChart.setOption(this.leftOption);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .quick-stats__info {
    padding-right: 3rem;
  }

  .stats__chart {
    height: 60px;
    width: 180px;
  }

  .flot-chart {
    height: 762px;
  }

  .flot-chart-right {
    height: 890px;
    margin: auto 0;
  }
</style>
