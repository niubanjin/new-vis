<template>
  <div class="index">
    <div class="row quick-stats">
      <div class="col-lg-7">
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
            <div ref="chartTopRight" class="flot-chart-right"></div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div ref="chartBottomRight" class="flot-chart-right"></div>
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
        leftChart: null,
        rightTopChart: null,
        rightBottomChart: null,
        zoomStart: '',
        zoomEnd: '',
      }
    },
    computed: {
      ...mapGetters([
        'leftBottomOption',
        'leftBottomData',
        'rightTopOption',
        'rightTopData',
        'rightBottomOption',
        'rightBottomData'
      ]),
      wordCloudParams(){
        return {
          start: this.zoomStart,
          end: this.zoomEnd
        }
      }
    },
    mounted() {
      this.leftChart = this.$echarts.init(this.$refs.chartLeft);
      this.rightTopChart = this.$echarts.init(this.$refs.chartTopRight);
      this.rightBottomChart = this.$echarts.init(this.$refs.chartBottomRight);
      this.leftChart.on('dataZoom', this.doDataZoomChange);
      this.paintLeftChart();
      this.paintRightTopChart();
      this.paintRightBottomChart();
    },
    methods: {
      ...mapActions([
        'getLeftBottomData',
        'getRightTopData',
        'getRightBottomData'
      ]),
      doDataZoomChange(param){
        let start, end;
        if(param.hasOwnProperty('batch')){
          start = param.batch[0].start;
          end = param.batch[0].end
        }else{
          start = param.start;
          end = param.end;
        }
        this.zoomStart = this.leftBottomData.time[Math.round(this.leftBottomData.time.length * (start / 100))];
        this.zoomEnd = this.leftBottomData.time[Math.round(this.leftBottomData.time.length * (end / 100)) - 1];
      },
      paintRightBottomChart(){
        this.getRightBottomData({
          user: 'aaaa',
          apu: 'asasd'
        }).then( () => {

          this.rightBottomChart.setOption(this.rightBottomOption)
        }).catch(err => {
          console.log(err)
        })
      },
      paintRightTopChart(){
        this.getRightTopData({

        }).then( () => {
          this.rightTopOption.xAxis.data = this.rightTopData['xLocation'];
          this.rightTopOption.yAxis.data = this.rightTopData['yLocation'];
          this.rightTopOption.series[0].data = this.rightTopData['data'];
          this.rightTopChart.setOption(this.rightTopOption)
        }).catch(err => {
          console.log(err)
        })
      },
      paintLeftChart(){
        this.getLeftBottomData({

        }).then( () => {
          this.zoomStart = this.leftBottomData.time[0];
          this.zoomEnd = this.leftBottomData.time[this.leftBottomData.time.length - 1];
          this.leftBottomOption.xAxis[0].data = this.leftBottomData.time;
          this.leftBottomOption.series[0].data = this.leftBottomData['inner'];
          this.leftBottomOption.series[1].data = this.leftBottomData['outer'];
          this.leftChart.setOption(this.leftBottomOption)
        }).catch(err => {
          console.log(err)
        })
      },
      changeWordCloudChart(newParam){
        console.log(newParam)
      },
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

    },
    watch: {
      wordCloudParams(newParam){
        if(newParam.start === '' || newParam.end === ''){
          return true
        }
        this.changeWordCloudChart(newParam);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .quick-stats__info {
    padding-right: 3rem;
  }

  .stats__chart {
    height: 60px;
    width: 180px;
  }

  .flot-chart {
    height: 890px;
  }

  .flot-chart-right {
    height: 400px;
  }
</style>
