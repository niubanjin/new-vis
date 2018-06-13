import axios from '../axios'
import common from '../common'
import echarts from 'echarts'

export default {
  //初始状态
  state:{
    statsOption: {
      xAxis: {
        type: 'category',
        data: [],
        show:false
      },
      yAxis: {
        type: 'value',
        show:false
      },
      series: [{
        data: [],
        type: 'bar',
        itemStyle:{
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 0, color: 'rgba(255, 222, 51, 0.5)'},
                {offset: 0.5, color: 'rgba(255, 153, 218, 0.5)'},
                {offset: 1, color: 'rgba(0, 153, 102, 0.5)'}
              ]
            )
          }
        }
      }]
    },
    leftOption:{
      color: ['rgba(0,153,102,0.8)', 'rgba(255,153,51,0.8)'],
      title: {
        text: '流量数据关系图',
        x: 'center',
        textStyle:{
          color:"rgba(218,218,218,0.5)"
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      axisPointer: {
        link: {xAxisIndex: 'all'}
    },
      legend: {
        data:['流量','访问量'],
        x: 'right',
        textStyle:{
          color:"rgba(218,218,218,0.5)"
        }
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          xAxisIndex: [0, 1],
          textStyle:{
            color:"rgba(218,218,218,0.8)"
          }
        },
        {
          type: 'inside',
          realtime: true,
          xAxisIndex: [0, 1],
          textStyle:{
            color:"rgba(218,218,218,0.8)"
          }
        }
      ],
      grid: [{
        left: 50,
        right: 50,
        height: '35%'
      }, {
        left: 50,
        right: 50,
        top: '55%',
        height: '35%'
      }],
      xAxis : [
        {
          gridIndex: 0,
          type : 'category',
          boundaryGap : false,
          axisLine: {
            onZero: true,
            lineStyle:{
              color:"rgba(218,218,218,0.5)"
            }
          },
          data: []
        },
        {
          gridIndex: 1,
          type : 'category',
          boundaryGap : false,
          axisLine: {
            onZero: true,
            lineStyle:{
              color:"rgba(218,218,218,0.5)"
            }
          },
          data: [],
          position: 'top'
        }
      ],
      yAxis : [
        {
          gridIndex: 0,
          name : '流量(GB)',
          type : 'value',
          axisLine: {
            lineStyle:{
              color:"rgba(218,218,218,0.5)"
            }
          },
        },
        {
          gridIndex: 1,
          name : '访问量(次)',
          type : 'value',
          inverse: true,
          axisLine: {
            lineStyle:{
              color:"rgba(218,218,218,0.5)"
            }
          },
        }
      ],
      series : [
        {
          name:'流量',
          type:'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          symbolSize: 8,
          hoverAnimation: false,
          data:[]
        },
        {
          name:'访问量',
          type:'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 8,
          hoverAnimation: false,
          data: []
        }
      ]
    },
    rightOption:{
      color: [],
      title: {
        left: 'center',
        text: '主机ip分布详情',
        subtext: '显示主机ip在网络中的占比',
        textStyle: {
          color: 'rgba(233,233,233,.8)'
        },
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: [5, 5, 0, 0]
      },
      toolbox: {
        left: 'right',
        feature: {
            restore: {}
        }
    },
      tooltip: {

      },
      series: [{
        type: 'treemap',
        name: 'ip',
        label: {
          normal: {
            formatter: function (params) {
              return [
                '{name|' + params.name + '}',
                '{hr|}',
                '{budget|流量 ' + echarts.format.addCommas(params.data.filelen) + '} {label|kb}',
                '{budget|访问量 ' + echarts.format.addCommas(params.data.connect) + '} {label|次}'
              ].join('\n');
            },
            rich: {
              budget: {
                fontSize: 10,
                lineHeight: 30,
                color: 'yellow'
              },
              household: {
                fontSize: 14,
                color: '#fff'
              },
              label: {
                fontSize: 12,
                backgroundColor: 'rgba(0,0,0,0.3)',
                color: '#fff',
                borderRadius: 2,
                padding: [2, 4],
                lineHeight: 25,
                align: 'right'
              },
              name: {
                fontSize: 12,
                color: '#fff'
              },
              hr: {
                width: '100%',
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 0.5,
                height: 0,
                lineHeight: 10
              }
            }
          }
        },
        leafDepth: 1,
        levels: [
          {
              itemStyle: {
                  normal: {
                      borderColor: '#555',
                      borderWidth: 2,
                      gapWidth: 2
                  }
              }
          },
          {
              colorSaturation: [0.3, 0.6],
              itemStyle: {
                  normal: {
                      borderColorSaturation: 0.7,
                      gapWidth: 1,
                      borderWidth: 1
                  }
              }
          },
          {
              colorSaturation: [0.3, 0.5],
              itemStyle: {
                  normal: {
                      borderColorSaturation: 0.6,
                      gapWidth: 1
                  }
              }
          },
          {
              colorSaturation: [0.3, 0.5]
          }
      ],
        data: [],
        itemStyle: {
          normal: {
            borderColor: 'rgba(0,0,0,0)'
          }
        },
      }]
    },
    statsOneGraph: [],
    statsTwoGraph: [],
    statsThreeGraph: [],
    leftGraph: {
      'filelen': {},
      'connect': {}
    },
    rightGraph: []
  },
  //获取器
  getters:{
    statsOneGraph: state => state.statsOneGraph,
    statsTwoGraph: state => state.statsTwoGraph,
    statsThreeGraph: state => state.statsThreeGraph,
    statsOption: state => state.statsOption,
    leftGraph: state => state.leftGraph,
    leftOption: state => state.leftOption,
    rightGraph: state => state.rightGraph,
    rightOption: state => state.rightOption
  },
  //突变
  mutations:{
    //数据修改操作
    alterStatsOneGraphData(state,data){
      state.statsOneGraph = data
    },
    alterStatsTwoGraphData(state,data){
      state.statsTwoGraph = data
    },
    alterStatsThreeGraphData(state,data){
      state.statsThreeGraph = data
    },
    alterLeftGraphData(state,data){
      state.leftGraph[data.reference] = data
    },
    alterRightGraphData(state,data){
      state.rightGraph = data
    }
  },
  //动作
  actions:{
    //向后台请求数据等操作
    getStatsOneData(context, form){
      return new Promise((resolve,reject)=>{
        axios.get('/api/host/active/' + common.convertParams(form)).then(({data})=>{
          context.commit('alterStatsOneGraphData',data.data);
          resolve();
        }).catch((error)=>{
          reject(error);
        });
      });
    },
    getStatsTwoData(context, form){
      return new Promise((resolve,reject)=>{
        axios.get('/api/flows/host/' + common.convertParams(form)).then(({data})=>{
          context.commit('alterStatsTwoGraphData',data.data);
          resolve();
        }).catch((error)=>{
          reject(error);
        });
      });
    },
    getStatsThreeData(context, form){
      return new Promise((resolve,reject)=>{
        axios.get('/api/flows/host/' + common.convertParams(form)).then(({data})=>{
          context.commit('alterStatsThreeGraphData',data.data);
          resolve();
        }).catch((error)=>{
          reject(error);
        });
      });
    },
    getLeftGraphData(context, form){
      return new Promise((resolve,reject)=>{
        axios.get('/api/flows/host/' + common.convertParams(form)).then(({data})=>{
          context.commit('alterLeftGraphData',data.data);
          resolve();
        }).catch((error)=>{
          reject(error);
        });
      });
    },
    getRightGraphData(context, form){
      return new Promise((resolve,reject)=>{
        axios.get('/api/category/ip/' + common.convertParams(form)).then(({data})=>{
          context.commit('alterRightGraphData',data.data);
          resolve();
        }).catch((error)=>{
          reject(error);
        });
      });
    }
  }
}
