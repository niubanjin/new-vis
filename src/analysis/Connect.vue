<template>
  <div class="analysis">
    <el-dialog
      :lockScroll="false"
      :beforeClose="() => {comChartParam = {type: undefined}; dialogFormVisible = false}"
      :visible.sync="dialogFormVisible"
      :title="dialogTitle">
      <com-port-chart
        v-if="comChartParam.type === 'port'"
        :param="comChartParam"
        @title="value => dialogTitle = value"/>
      <com-axis-chart
        v-else-if="comChartParam.type === 'access'"
        :param="comChartParam"
        @title="value => dialogTitle = value"/>
    </el-dialog>
    <div class="row">
      <div class="col-lg-4">
        <div class="row" :style="style.lineChartForm">
          <el-form label-width="120px" size="small">
            <el-form-item class="lineForm" label="缩放条起止时间">
              <el-select :style="style.inputWidthStyle"  value="" v-model="zoomStart" @change="changeZoomData('start')" placeholder="请选择">
                <el-option
                  v-for="item in zoomStartList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>&nbsp;&nbsp;&nbsp;—&nbsp;&nbsp;
              <el-select :style="style.inputWidthStyle"  value="" v-model="zoomEnd" @change="changeZoomData('end')" placeholder="请选择">
                <el-option
                  v-for="item in zoomEndList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="折线图参照">
              <el-cascader
                :style="style.inputWidthStyle"
                expand-trigger="hover"
                :options="form.label.referLabel"
                v-model="referValue">
              </el-cascader>
              <el-tag :style="style.tagMarginStyle" type="info">
                {{typeMap[reference][type].split('/')[0] + ': ' + referTypeTotal + ' ' + typeMap[reference][type].split('/')[1]}}
              </el-tag>
            </el-form-item>
            <el-form-item label="时间粒度">
              <el-select :style="style.inputWidthStyle" value="" v-model="granularity" placeholder="请选择">
                <el-option
                  v-for="item in [{label: '按小时统计', value: 'hours'}, {label: '按天统计', value: 'days'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-tag :style="style.tagMarginStyle" type="info">
                {{'总计 ' + timeLength  + ' ' + granularityMap[granularity]}}
              </el-tag>
            </el-form-item>
            <el-form-item label="数据值">
              <el-select :style="style.inputWidthStyle" value="" v-model="lineChartType" placeholder="请选择">
                <el-option
                  v-for="item in [{label: '叠加值', value: '叠加值'}, {label: '离散值', value: '离散值'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-tag :style="style.tagMarginStyle" type="info">
                {{'最大值: ' + referTypeMax + ' ' +typeMap[reference][type].split('/')[1]}}&nbsp;&nbsp;&nbsp;&nbsp;{{parseFloat(style.tagMarginStyle['margin-left']) > 30 ?'平均值: ' + referTypeAverage + ' ' +typeMap[reference][type].split('/')[1] : ''}}
              </el-tag>
            </el-form-item>
            <el-switch
              style="float: right"
              active-value="true"
              active-text="显示边缘主机"
              inactive-value="false"
              inactive-text="隐藏边缘主机"
              v-model="leaf">
            </el-switch>
          </el-form>
        </div>
        <div class="row">
          <div id="connLineChart" :style="style.lineChartStyle" class="myCharts"></div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="row">
          <div id="connGraphChart" :style="style.graphChartStyle" class="myCharts"></div>
        </div>
        <div class="row">
          <el-form class="graphForm" label-width="120px" size="small">
            <div class="row">
              <div class="col-lg-9">
                <el-form-item label="边宽度最大值">
                  <el-slider  v-model="linkWidth" :min="linkWidthEnable ? 8 : 1" :max="linkWidthEnable ? 20 : 10" :step="1" show-input></el-slider>
                </el-form-item>
                <el-form-item label="阈值参数">
                  <el-select :style="style.inputWidthStyle" value="connect" v-model="symbol" placeholder="请选择">
                    <el-option
                      v-for="item in symbolOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-tag class="graphTag" type="info">
                    {{symbolOption[symbolOption.findIndex(i => i.value === symbol)].label + '最大值: ' + symbolMax + (symbol === 'degree' ? '' : typeMap[symbol][type].split('/')[1])}}
                  </el-tag>
                </el-form-item>
                <el-form-item class="threshold" label="阈值">
                  <el-input-number :style="style.inputWidthStyle" size="small" v-model="threshold" :min="1"></el-input-number>
                  <el-tag class="graphTag" type="info">
                    {{'主机节点个数: ' + nodeCount}}
                  </el-tag>
                </el-form-item>
                <el-form-item label="绘制参数">
                  <el-select :style="style.inputWidthStyle" value="days" v-model="comLineChartGranularity" placeholder="请选择">
                    <el-option
                      v-for="item in [{label: '按天统计', value: 'days'}, {label: '按小时统计', value:'hours'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select :style="style.inputWidthStyle" value="离散值" style="float: right" v-model="comLineChartType" placeholder="请选择">
                    <el-option
                      v-for="item in [{label: '叠加值', value: '叠加值'}, {label: '离散值', value: '离散值'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :style="screenWidth > 1600 ?{} : {'text-align': 'center'}">
                  <el-switch
                    :style="screenWidth > 1600 ? {float: 'left'} : {}"
                    :active-value="true"
                    active-text="绑定边"
                    :inactive-value="false"
                    inactive-text="不绑定边"
                    v-model="linkBind"
                    @change="doBindChange">
                  </el-switch>
                  <el-switch
                    :style="screenWidth > 1600 ? {float: 'right'} : {}"
                    :active-value="true"
                    active-text="应用边宽度"
                    :inactive-value="false"
                    inactive-text="取消边宽度"
                    v-model="linkWidthEnable">
                  </el-switch>
                </el-form-item>
              </div>
              <div class="col-lg-3">
                <div class="row">
                    <div >大<el-input-number
                      v-model="linkLimit[1]"
                      :controls="screenWidth >= 1860"
                      :controls-position="screenWidth >= 1860 ? 'right' : '-'"
                      size="mini"
                      :style="style.inputNumberStyle"
                      :step="1"/></div>
                    <el-slider
                      style="margin-top: 20px"
                      :min="0"
                      :max="linkRefereneMax"
                      range
                      :step="1"
                      v-model="linkLimit"
                      vertical
                      height="146px">
                    </el-slider>
                    <div >小<el-input-number
                      value="10"
                      v-model="linkLimit[0]"
                      :controls="screenWidth >= 1860"
                      :controls-position="screenWidth >= 1860 ? 'right' : '-'"
                      size="mini"
                      :style="style.inputNumberStyle"
                      :step="1"/></div>
                </div>
                <div class="row">
                  <el-tag  type="info" style="margin: 25px 0 0 20px">
                    {{'  边条数: ' + linkCount}}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="col-lg-3">
        <el-scrollbar :style="{height: (screenHeight - 102) + 'px'}">
          <com-line-chart v-if="lineChartList.length > 0"
            v-for="lineChartItem in lineChartList"
            :param="lineChartItem"
            :key="lineChartItem.key"
            @onclose="doChartClose"
            @ondraw="doChartDraw"
            width="100%"
            height="200px"/>
          <div style="height:80px;width:60%;margin: 380px auto;text-align: center" v-if="lineChartList.length <= 0">
            <p style="font-size: 24px"><b>暂无图表!!</b></p><br /><p style="font-size: 18px">请点击左侧节点连接图中的节点或边绘制主机通信折线图</p>
          </div>

        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import comLineChart from './ComLineChart'
  import comPortChart from './ComPortChart'
  import comAxisChart from './ComPAxisChart'

  export default {
    name: "Analysis",
    data() {
      return {
        lineChart: null,
        graphChart: null,
        dialogFormVisible:false,
        dialogTitle:'',
        screenWidth: document.body.clientWidth,
        screenHeight: document.documentElement.clientHeight,
        style: {
          inputWidthStyle: {
            width: '150px'
          },
          tagMarginStyle: {
            'margin-left': '26.25px'
          },
          inputNumberStyle: {
            width: '130px',
            'padding-left': '20px'
          },
          lineChartForm: {
            height: '340px'
          },
          lineChartStyle: {
            height: '560px'
          },
          graphChartStyle: {
            height: '680px'
          }
        },
        comChartParam: {
          type: undefined
        },
        form: {
          label: {
            referLabel: [
              {
              value: 'filelen',
              label: '流量',
              children: [{
                value: 'false',
                label: '正常'
              }, {
                value: 'true',
                label: '丢包'
              }]
            }, {
              value: 'connect',
              label: '访问量',
              children: [{
                value: 'false',
                label: '正常'
              }, {
                value: 'true',
                label: '丢包'
              }]
            }]
          }
        },
        categories: ['10', '172', '196'],
        cracked: 'false',
        leaf: 'true',
        reference: 'connect',
        type: 'total',
        typeMap: {
          filelen: {
            total: '总流量/MB',
            send: '发送流量/MB',
            recv: '接收流量/MB'
          },
          connect: {
            'send': '访问量/次',
            'recv': '被访问量/次',
            'total': '总访问量/次'
          }
        },
        referTypeTotal: 0,
        referTypeMax: 0,
        referTypeAverage: 0,
        granularity: 'hours',
        granularityMap: {
          hours: '小时',
          days: '天'
        },
        timeLength: 0,
        symbol: 'degree',
        symbolOption: [{label: '主机流量', value: 'filelen'},{label: '主机访问量', value: 'connect'},{label: '节点度', value: 'degree'}],
        symbolMax: 0,
        threshold: 50,
        nodeCount: 0,
        linkLimit: [10,11],
        linkWidth: 10,
        linkWidthEnable: true,
        linkBind: true,
        linkRefereneMax: 0,
        linkME: 0,
        linkCount: 0,
        maxLineWidth: 5,
        zoomStart: '',
        zoomEnd: '',
        lineChartList: [],
        lineChartType: '离散值',
        comLineChartType: '离散值',
        comLineChartGranularity: 'hours',
        graphColors: ['#096', '#ff9933', '#cc4433'],
        pieces: [{
          gt: 0,
          lte: 0,
          color: '#096'
        }, {
          gt: 0,
          lte: 0,
          color: '#ffde33'
        }, {
          gt: 0,
          lte: 0,
          color: '#ff9933'
        }, {
          gt: 0,
          lte: 0,
          color: '#cc4433'
        }, {
          gt: 0,
          color: '#cc0023'
        }]
      }
    },
    components:{
      'comLineChart': comLineChart,
      'comPortChart': comPortChart,
      'comAxisChart': comAxisChart
    },
    computed: {
      ...mapGetters(['connLineData', 'connGraphData', 'connLineOption', 'connGraphOption']),
      referValue: {
        get(){
          return [this.reference, this.cracked]
        },
        set(value){
          this.reference = value[0];
          this.cracked = value[1];
        }
      },
      paintGraphChartParam(){
        return {
          symbol: this.symbol,
          threshold: this.threshold,
          cracked: this.cracked,
          leaf: this.leaf
        }
      },
      changeGraphChartParam(){
        return {
          reference: this.reference,
          linkLimit: this.linkLimit,
          linkWidth: this.linkWidth,
          linkWidthEnable: this.linkWidthEnable
        }
      },
      paintLineChartParam(){
        return {
          granularity: this.granularity,
          type: this.type,
          reference: this.reference,
          cracked: this.cracked
        }
      },
      changeLineChartParam(){
        return {
          lineChartType: this.lineChartType
        }
      },
      zoomStartList(){
        if(this.connLineData.length <= 0)
          return [];
        else
          return this.connLineData.time.map(item => {
            return {
              lable: item,
              value: item
            }
          })
      },
      zoomEndList(){
        if(this.connLineData.length <= 0)
          return [];
        else{
          let zoomStart = this.zoomStart === '' ? this.connLineData.time[0] : this.zoomStart;
          let endList = [];
          this.connLineData.time.forEach(item => {
            if(item >= zoomStart){
              endList.push({
                lable: item,
                value: item
              })
            }
          });
          return endList
        }
      },
    },
    mounted() {
      const self = this;
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth;
          // window.screenHeight = document.documentElement.clientHeight;
          self.screenWidth = window.screenWidth;
          // self.screenHeight = window.screenHeight;
          // console.log(self.screenHeight)
        })()
      };
      this.resetStyle();
      this.lineChart = this.$echarts.init(document.getElementById('connLineChart'));
      this.graphChart = this.$echarts.init(document.getElementById('connGraphChart'));
      this.connGraphOption.toolbox.feature.myTool.onclick = this.drawGraphChart;
      this.drawLineChart();
      this.drawGraphChart();
      this.graphChart.on('click', this.doLinkClick);
      this.lineChart.on('dataZoom', this.doDataZoom);
      this.linkLimit[0] = 10;
    },
    methods: {
      resetStyle(){
        let scale = this.screenWidth / 1920;
        this.style.inputWidthStyle.width = Math.round(scale * 200) + 'px';
        this.style.tagMarginStyle['margin-left'] = Math.round(scale * 35) + 'px';
        this.style.inputNumberStyle.width = Math.round(scale * 130) + 'px';
        //
        // let scaleHeight = this.screenHeight -  102;
        // this.style.lineChartForm.height = Math.floor(0.38 * scaleHeight) + 'px';
        // this.style.lineChartStyle.height = Math.ceil(0.62 * scaleHeight) + 'px';
        // this.style.graphChartStyle.height = Math.round(0.75 * scaleHeight) + 'px';
      },
      ...mapActions(['getConnLineData', 'getConnGraphData']),
      changeZoomData(param){
        let length = this.connLineData.time.length;
        if(param === 'start'){
          let startindex = this.connLineData.time.findIndex(i => i === this.zoomStart) / length * 100;
          this.connLineOption.dataZoom[0].start = startindex;
        }else{
          let endindex = (this.connLineData.time.findIndex(i => i === this.zoomEnd) + 1) / length * 100;
          this.connLineOption.dataZoom[0].end = endindex;
        }
        this.lineChart.setOption(this.connLineOption);
      },
      doChartDraw(param){
        this.dialogFormVisible = true;
        this.comChartParam = param
      },
      doBindChange(){
        this.connGraphOption.series[0].lineStyle.curveness = this.linkBind ? 0.3 : 0;
        this.graphChart.setOption(this.connGraphOption)
      },
      doChartClose(param){
        for(let i = 0; i < this.lineChartList.length; i++){
          if(this.lineChartList[i].key === param.key){
            this.lineChartList.splice(i, 1);
            break;
          }
        }
      },
      doLinkClick(params) {
        if(params.dataType === 'edge'){
          let ip1 = params.data.source;
          let ip2 = params.data.target;
          let key = ip1 + ip2 + this.reference + this.zoomStart + this.zoomEnd +
            this.comLineChartType + this.comLineChartGranularity;
          for(let i in this.lineChartList){
            if(this.lineChartList[i].key === key)
              return
          }
          this.lineChartList.push({
            ips: [ip1, ip2],
            start: this.zoomStart,
            end: this.zoomEnd,
            key: key,
            reference: this.reference,
            lineChartType: this.comLineChartType,
            granularity: this.comLineChartGranularity,
            dataType: 'edge'
          })
        } else if(params.dataType === 'node') {
          let ip = params.data.name;
          let key = ip + this.reference + this.zoomStart + this.zoomEnd +
            this.comLineChartType + this.comLineChartGranularity;
          for(let i in this.lineChartList){
            if(this.lineChartList[i].key === key)
              return
          }
          this.lineChartList.push({
            ips: [ip],
            start: this.zoomStart,
            end: this.zoomEnd,
            key: key,
            reference: this.reference,
            lineChartType: this.comLineChartType,
            granularity: this.comLineChartGranularity,
            dataType: 'node'
          })
        }
      },
      doDataZoom(params) {
        let start, end;
        if(params.hasOwnProperty('batch')){
          start = params.batch[0].start;
          end = params.batch[0].end
        }else{
          start = params.start;
          end = params.end;
        }
        this.zoomStart = this.connLineData.time[Math.round(this.connLineData.time.length * (start / 100))];
        this.zoomEnd = this.connLineData.time[Math.round(this.connLineData.time.length * (end / 100)) - 1];
      },
      changeLineChart(){
        // let length = this.connLineData.time.length;
        // let startIndex = this.connLineData.time.findIndex(i => i === this.zoomStart) / length * 100;
        // let endIndex = (this.connLineData.time.findIndex(i => i === this.zoomEnd) + 1) / length * 100;
        // this.connLineOption.dataZoom[0].start = startIndex;
        // this.connLineOption.dataZoom[0].end = endIndex;
        let scale = this.reference === 'filelen' ? 1024 : 1;
        if(this.lineChartType === '离散值'){
          this.connLineOption.series[0].data = this.connLineData[this.type].map((data) => {
            return data / scale;
          });
          let step = Math.floor(this.referTypeMax / 50000) * 10000;
          let left = 0, right = step;
          this.connLineOption.visualMap.pieces = this.pieces.map((piece) => {
            piece.gt = left;
            if (piece.hasOwnProperty('lte'))
              piece.lte = right;
            left = right;
            right += step;
            return piece;
          });
          // this.connLineOption.visualMap.show = true;
        }else{
          let sum = 0;
          this.connLineOption.series[0].data = this.connLineData[this.type].map((data) => {
            sum += data / scale;
            return sum
          });
          // this.connLineOption.visualMap.show = false;
          this.connLineOption.visualMap.pieces = []
        }
        this.lineChart.setOption(this.connLineOption);
      },
      drawLineChart() {
        this.getConnLineData({
          granularity: this.granularity,
          type: this.type,
          reference: this.reference,
          cracked: this.cracked
        }).then(() => {
          this.referTypeTotal = 0;
          this.referTypeMax = 0;
          this.connLineOption.xAxis.data = this.connLineData.time;
          if(this.zoomStart === '' || this.zoomEnd === ''){
            this.zoomStart = this.connLineData.time[0];
            this.zoomEnd = this.connLineData.time[this.connLineData.time.length - 1];
          }else{
            let length = this.connLineData.time.length;
            let startIndex = this.connLineData.time.findIndex(i => i === this.zoomStart) / length * 100;
            let endIndex = (this.connLineData.time.findIndex(i => i === this.zoomEnd) + 1) / length * 100;
            this.connLineOption.dataZoom[0].start = startIndex;
            this.connLineOption.dataZoom[0].end = endIndex;
          }
          this.connLineOption.yAxis.name = this.typeMap[this.reference][this.type];
          this.connLineOption.title.text = '主机' + this.connLineOption.yAxis.name.split('/')[0] + '统计折线图';
          let scale = this.reference === 'filelen'? 1024 : 1;
          let res = 0;
          if(this.lineChartType === '离散值'){
            this.connLineOption.series[0].data = this.connLineData[this.type].map((data) => {
              res = data / scale;
              this.referTypeMax = this.referTypeMax > res ? this.referTypeMax : res;
              this.referTypeTotal += res;
              return res
            });
            let step = this.referTypeMax > 50000 ? Math.floor(this.referTypeMax / 50000) * 10000 : Math.floor(this.referTypeMax / 5);
            let left = 0, right = step;
            this.connLineOption.visualMap.pieces = this.pieces.map((piece) => {
              piece.gt = left;
              if (piece.hasOwnProperty('lte'))
                piece.lte = right;
              left = right;
              right += step;
              return piece;
            });
            // this.connLineOption.visualMap.show = true;
          }else{
            this.connLineOption.series[0].data = this.connLineData[this.type].map((data) => {
              res = data / scale;
              this.referTypeTotal += res;
              return this.referTypeTotal
            });
            // this.connLineOption.visualMap.show = false;
          }
          this.timeLength = this.connLineData.time.length;
          this.referTypeTotal = Math.round(this.referTypeTotal);
          this.referTypeAverage = Math.round(this.referTypeTotal / this.timeLength);
          this.referTypeMax = Math.round(this.referTypeMax);
          this.lineChart.setOption(this.connLineOption)
        }).catch((err) => {
          console.log(err)
        });
      },
      changeGraphChart(){
        let scale = 1 / this.connGraphData.node_max[this.reference] * (this.linkWidth + 10);
        this.connGraphOption.series[0].data.forEach(node => {
          let symbolSize = Math.round(node[this.reference] * scale);
          node.symbolSize = symbolSize < 6 ? 5 : symbolSize
        });
        let links = [], referValue = 0;
        let min = Number.MAX_SAFE_INTEGER, max = Number.MIN_SAFE_INTEGER;
        this.linkRefereneMax = this.connGraphData.max[this.reference]+ 1;
        this.linkLimit[1] = this.linkRefereneMax;
        let referMax = this.linkRefereneMax;
        let excepts = {}, index;
        let step = Math.round(referMax / 100);
        for(let i = 0; i <= 101; i++){
          excepts[i * step] = 0
        }
        this.connGraphData.links.forEach(link => {
          referValue = link[this.reference];
          if (referValue >= this.linkLimit[0] && referValue <= this.linkLimit[1]) {
            max = Math.max(max, referValue);
            min = Math.min(min, referValue);
            let res_link = {
              source: link.source,
              target: link.target
            };
            res_link[this.reference] = referValue;
            links.push(res_link);
            index = Math.floor(referValue / 100) * 100;
            for(let key in excepts){
              if(key > index){
                excepts[key]++;
                break;
              }
            }
          }
        });
        let ME = this.getME(links.length, excepts);
        let top = max - min;
        scale = 2 / (max - ME);
        this.connGraphOption.series[0].edges = [];
        links.forEach(link => {
          referValue = link[this.reference];
          link.lineStyle = {
            color: referValue >= ME ? this.graphColors[Math.floor(scale * (referValue - ME))] : 'rgba(233,233,233,0.8)'
          };
          if(this.linkWidthEnable){
            link.lineStyle.width = Math.ceil((referValue - min) / top * this.linkWidth);
            if (link.lineStyle.width > 1) {
              this.connGraphOption.series[0].edges.push(link)
            }
          }else{
            link.lineStyle.width = this.linkWidth;
            this.connGraphOption.series[0].edges.push(link)
          }
        });
        this.linkCount = this.connGraphOption.series[0].edges.length;
        this.graphChart.setOption(this.connGraphOption)
      },
      drawGraphChart() {
        this.getConnGraphData({
          granularity: this.granularity,
          symbol: this.symbol,
          threshold: this.threshold,
          cracked: this.cracked,
          start: this.zoomStart,
          end: this.zoomEnd,
          leaf: this.leaf
        }).then(() => {
          this.symbolMax = 0;
          this.nodeCount = 0;
          this.connGraphOption.legend.data = this.categories;
          this.connGraphOption.series[0].categories = this.categories.map((item) => {
            return {name: item}
          });
          let scale = 1 / this.connGraphData.node_max[this.reference] * (this.linkWidth + 10);
          this.connGraphOption.series[0].data = this.connGraphData.nodes.map((node) => {
            let category = this.categories.findIndex(i => i === node.name.split('.')[0]);
            let symbolSize = Math.round(node[this.reference] * scale);
            this.symbolMax = Math.max(this.symbolMax, node[this.symbol]);
            this.nodeCount++;
            return {
              id: node.name,
              name: node.name,
              filelen: node.filelen,
              connect: node.connect,
              symbolSize: symbolSize < 6 ? 5 : symbolSize,
              value: node.degree,
              category: category,
            }
          });
          let links = [], referValue = 0;
          let min = Number.MAX_SAFE_INTEGER, max = Number.MIN_SAFE_INTEGER;
          this.linkRefereneMax = this.connGraphData.max[this.reference] + 1;
          this.linkLimit[1] = this.linkRefereneMax;
          let referMax = this.linkRefereneMax;
          let excepts = {}, index;
          let step = Math.round(referMax / 100);
          for(let i = 0; i <= 101; i++){
            excepts[i * step] = 0
          }
          this.connGraphData.links.forEach(link => {
            referValue = link[this.reference];
            if (referValue >= this.linkLimit[0] && referValue <= this.linkLimit[1]) {
              max = Math.max(max, referValue);
              min = Math.min(min, referValue);
              let res_link = {
                source: link.source,
                target: link.target
              };
              res_link[this.reference] = referValue;
              links.push(res_link);
              index = Math.floor(referValue / 100) * 100;
              for(let key in excepts){
                if(key > index){
                  excepts[key]++;
                  break;
                }
              }
            }
          });
          let ME = this.getME(links.length, excepts);
          let top = max - min;
          scale = 2 / (max - ME);
          this.connGraphOption.series[0].edges = [];
          links.forEach(link => {
            referValue = link[this.reference];
            link.lineStyle = {
              color: referValue >= ME ? this.graphColors[Math.floor(scale * (referValue - ME))] : 'rgba(233,233,233,0.8)'
            };
            if(this.linkWidthEnable){
              link.lineStyle.width = Math.ceil((referValue - min) / top * this.linkWidth);
              if (link.lineStyle.width > 1) {
                this.connGraphOption.series[0].edges.push(link)
              }
            }else{
              link.lineStyle.width = this.linkWidth;
              this.connGraphOption.series[0].edges.push(link)
            }
          });
          this.linkCount = this.connGraphOption.series[0].edges.length;
          scale = this.symbol === 'filelen' ? 1024 : 1;
          this.symbolMax = Math.round(this.symbolMax / scale);
          this.graphChart.setOption(this.connGraphOption)
        }).catch((err) => {
          console.log(err)
        });
      },
      getME(length, pd){
        let me = 0, scale;
        for(let key in pd){
          scale = pd[key] / length;
          me += scale * key
        }
        return me
      }
    },
    watch: {
      paintLineChartParam(){
        this.drawLineChart();
      },
      changeLineChartParam(){
        if(this.connLineOption.series[0].data.length > 0)
          this.changeLineChart();
      },
      paintGraphChartParam(newParam, oldParam){
        if(oldParam.symbol === 'degree'){
          if(newParam.symbol === 'filelen' && newParam.threshold < 5000){
            this.threshold = 15000000
          }else if(newParam.symbol === 'connect' && (newParam.threshold < 500 || newParam.threshold > 100000)){
            this.threshold = 2000
          }
        }else if(oldParam.symbol === 'filelen'){
          if(newParam.symbol === 'connect' && (newParam.threshold < 500 || newParam.threshold > 100000)){
            this.threshold = 2000
          }else if(newParam.symbol === 'degree' && (newParam.threshold > 500)){
            this.threshold = 50
          }
        }else if(oldParam.symbol === 'connect'){
          if(newParam.symbol === 'filelen' && newParam.threshold < 100000){
            this.threshold = 15000000
          }else if(newParam.symbol === 'degree' && (newParam.threshold > 500)){
            this.threshold = 50
          }
        }
        this.drawGraphChart();
      },
      changeGraphChartParam(){
        if(this.connGraphOption.series[0].data.length > 0)
          this.changeGraphChart();
      },
      granularity(){
        this.zoomEnd = '';
        this.zoomStart = '';
      },
      screenWidth (val) {
        this.screenWidth = val;
        let scale = val / 1920;
        this.style.inputWidthStyle.width = Math.round(scale * 200) + 'px';
        this.style.tagMarginStyle['margin-left'] = Math.round(scale * 35) + 'px';
        this.style.inputNumberStyle.width = Math.round(scale * 130) + 'px';
        //
        // let scaleHeight = this.screenHeight -  102;
        // this.style.lineChartForm.height = Math.floor(0.38 * scaleHeight) + 'px';
        // this.style.lineChartStyle.height = Math.ceil(0.62 * scaleHeight) + 'px';
        // this.style.graphChartStyle.height = Math.round(0.75 * scaleHeight) + 'px';
      },
      screenHeight (val) {
        // this.screenHeight = val;
        console.log(this.screenHeight);
      }
    }
  }
</script>

<style>

  .el-cascader__label, .el-tag--info, .el-input__inner, .el-dialog__title{
    color: rgba(233, 233, 233, 0.8)
  }

  .lineForm {
    padding-top: 3.5rem;
  }
  .graphForm {
    padding: 0 0 0 0;
  }

  .el-form-item__label{
    color: rgba(233, 233, 233, 0.8)
  }
  .el-input__inner, .el-input-number__decrease, .el-input-number__increase, .el-slider__button,.el-slider__bar, .el-slider__runway{
    background-color: transparent;
  }
  .el-switch__core{
    border-color: #fff4d3;
    background-color: transparent;
  }
  .el-switch.is-checked .el-switch__core{
    border-color: #fff4d3;
    background-color: transparent;
  }
  .el-switch__core:after{
    background-color: transparent;
    border: 1px solid #fff4d3;
  }
  .el-slider__runway {
    border: 1px solid rgba(233,233,233,0.8);
  }
  .threshold .el-input-number--small{
    width: 198px;
  }

  /* .el-cascader-menu, .el-cascader-menus{
    background-color: rgba(0, 0, 0, 0.1);
  } */
  .referTag{
    margin-left: 2.7rem
  }
  .graphTag{
    float: right;
    /*margin-right: 2rem;*/
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .analysis .themes {
    width: 300px;
  }

  #connGraphChart {
    height: 680px;
  }
  .com_linechart{
    margin: 10px 0;
  }
  .el-dialog__body{
    height: 100%;
    padding: 0;
  }
  .el-dialog{
    /*position: absolute;*/
    width: 70%;
    height: 60%;
    /*left: 20%;*/
    background-color: rgba(0,0,0,1);
  }
</style>
