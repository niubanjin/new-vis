<template>
  <div class="email">
    <div class="row quick-stats">
      <div class="col-lg-7">
        <div class="card">
          <div class="card-body">
            <div ref="chartLeft" class="flot-chart"></div>
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
        groupCategories: [],
        groupColors: [],
        indices: {
          group: 0
        }
      }
    },
    computed: {
      ...mapGetters([
        'leftOption',
        'leftData',
        'emailRightTopOption',
        'emailRightTopData',
        'emailRightBottomOption',
        'emailRightBottomData'
      ]),
    },
    mounted() {
      this.leftChart = this.$echarts.init(this.$refs.chartLeft);
      this.leftChart.on('click', this.doLeftChartClick);
      this.rightTopChart = this.$echarts.init(this.$refs.chartTopRight);
      this.rightBottomChart = this.$echarts.init(this.$refs.chartBottomRight);
      this.paintLeftChart();
    },
    methods: {
      ...mapActions([
        'getLeftData',
        'getEmailRightTopData',
        'getEmailRightBottomData'
      ]),
      doLeftChartClick(param){
        //点击节点连接图节点时触发
        if(param.dataType === 'node') {

        }
      },
      paintRightBorttomChart(){
        this.getEmailRightBottomData({

        }).then( () => {

          this.rightBottomChart.setOption(this.emailRightBottomOption)
        }).catch(err => {
          console.log(err)
        })
      },
      //绘制右上角图像
      paintRightTopChart(){
        this.getEmailRightTopData({

        }).then( () => {

          this.rightTopChart.setOption(this.emailRightTopOption)
        }).catch(err => {
          console.log(err)
        })
      },
      //绘制左侧图像
      paintLeftChart(){
        this.getLeftData({

        }).then( () => {

          this.leftChart.setOption(this.leftOption)
        }).catch(err => {
          console.log(err)
        })
      },
      //一个用于生成颜色的功能函数
      normalizeData(originData) {
        let groupMap = {};
        originData.forEach((row) => {
          let groupName = row[this.indices.group];
          if (!groupMap.hasOwnProperty(groupName)) {
            groupMap[groupName] = 1;
          }
        });
        this.groupCategories = [];
        for (let groupName in groupMap) {
          if (groupMap.hasOwnProperty(groupName)) {
            this.groupCategories.push(groupName);
          }
        }
        let hStep = Math.round(300 / (this.groupCategories.length - 1));
        this.groupColors = [];
        for (let i = 5; i < this.groupCategories.length + 5; i++) {
          this.groupColors.push(this.$echarts.color.modifyHSL('#5A94DF', hStep * i));
        }
      },
    },
    watch: {

    }
  }
</script>

<style scoped>

  .flot-chart {
    height: 890px;
  }

  .flot-chart-right {
    height: 400px;
  }
</style>
