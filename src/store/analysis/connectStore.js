import axios from '../axios'
import common from '../common'

export default {
  //初始状态
  state: {
    lineData: [],
    lineOption: {
      color: ['#ff9933'],
      title:{
        text: '主机统计图',
        x: 'center',
        textStyle: {
          color: 'rgba(233,233,233,0.8)'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
          color: 'rgba(233,233,233,0.8)'
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(233,233,233,0.8)'
          }
        },
        name: ''
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
        splitLine: {
          show: false
        }
      },
      visualMap: {
        show: false,
        top: 10,
        right: 10,
        pieces: [],
        outOfRange: {
          color: 'rgba(255,255,255,0.3)'
        }
      },
      dataZoom: [
        {
          type:'inside'
        }, {
          type: 'slider',
          dataBackground:{
            lineStyle: {
              color: 'rgba(255,255,255,1)'
            },
            areaStyle: {
              color: 'rgba(60,60,60,0.5)'
            }
          },
          fillerColor: 'rgba(255,255,255,0.3)',
          textStyle: {
            color: '#ffffff'
          }
        }
      ],
      series: [{
        data: [],
        type: 'line',
        smooth: true,
      }]
    },
    graphData: [],
    graphOption: {
      color:['#ffde33','#356b1f', '#998f37'],
      legend: {
        show:false,
        data: [],
        textStyle: {
          color: '#fff'
        },
        left:'center'
      },
      toolbox: {
        show: true,
        orient: 'horizontal',
        left: '10%',
        top: '90%',
        y: '100',
        color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e'],
        backgroundColor: 'rgba(0,0,0,0)', // 工具箱背景颜色
        borderColor: '#cc0023',       // 工具箱边框颜色
        borderWidth: 0,            // 工具箱边框线宽，单位px，默认为0（无边框）
        padding: 5,                // 工具箱内边距，单位px，默认各方向内边距为5，
        showTitle: true,
        feature: {
          myTool: {
            show: true,
            title: '更新图表',
            // icon:'path://fill=#cc0023 d=M5056.2,4993.4c-21.2-11.6-46.4-34.8-57.9-52.2c-11.6-17.4-23.2-258.9-29-562.3l-9.7-531.4l-231.9-11.6C2849.6,3733.5,1203.4,2332.7,778.3,475.8C670.1,2.4,646.9-596.6,718.4-1083.6c202.9-1391.2,1074.3-2600.8,2338-3240.4c409.6-208.7,772.9-328.5,1236.6-411.6c365.2-63.7,946.8-73.4,1294.6-19.3c759.4,119.8,1410.5,396.1,2038.5,869.5c199,150.7,626.1,577.8,776.8,776.8c560.4,743.9,852.1,1534.2,906.2,2448.1l13.5,226.1l-59.9,58c-71.5,71.5-143,77.3-204.8,15.4c-40.6-40.6-46.4-69.6-58-286C8897.6-2469,7711.2-3927.8,5974.1-4364.5c-469.5-117.9-1101.4-150.7-1565.1-81.2c-1789.3,272.5-3141.8,1632.7-3389.2,3410.4C956-586.9,985,14,1089.4,466.1C1359.9,1639,2188.8,2659.2,3280.5,3163.5c467.6,216.4,1082.1,363.3,1520.7,365.2h168.1V2951c0-537.2,1.9-579.7,36.7-622.2c81.1-100.5,98.5-92.7,1257.9,577.7c1159.4,672.4,1153.6,668.6,1103.3,792.2c-19.3,46.4-200.9,158.4-1099.4,678.2c-591.3,342-1097.5,626.1-1124.6,631.9C5116.2,5012.7,5077.5,5006.9,5056.2,4993.4z M6576.9,3839.8c179.7-102.4,324.6-189.4,324.6-195.2c0-5.8-322.7-197.1-718.8-425.1c-396.1-228-761.3-438.6-811.5-469.5l-92.7-52.2v944.9v946.8l488.8-282.1C6034,4152.8,6399.2,3942.2,6576.9,3839.8z',
            icon: 'image://static/refresh.svg',
            onclick: undefined
          }
        }
      },
      series: [{
        type: 'graph',
        layout: 'force',
        animation: false,
        label: {
          normal: {
            position: 'right',
            formatter: '{b}'
          }
        },
        draggable: false,
        roam: true,
        focusNodeAdjacency: true,
        data: [],
        categories: [],
        force: {
          initLayout: 'circular',
          edgeLength: 50,
          repulsion: 100,
          gravity: 0.3,
          layoutAnimation: true
        },
        edges: [],
        lineStyle: {
          curveness: 0.3
        }
      }]
    }
  },
  //获取器
  getters: {
    connLineData(state) {
      return state.lineData
    },
    connLineOption(state) {
      return state.lineOption
    },
    connGraphData(state) {
      return state.graphData
    },
    connGraphOption(state) {
      return state.graphOption
    }
  },
  //突变
  mutations: {
    alterConnLineData(state, data) {
      state.lineData = data
    },
    alterConnGraphData(state, data) {
      state.graphData = data
    }
  },
  //动作
  actions: {
    getConnLineData(context, form) {
      return new Promise((resolve, reject) => {
        axios.get('/api/flows/host/' + common.convertParams(form)).then(({data}) => {
          context.commit('alterConnLineData', data.data);
          resolve();
        }).catch((err) => {
          reject(err);
        })
      })
    },
    getConnGraphData(context, form) {
      return new Promise((resolve, reject) => {
        axios.get('/api/graph/' + common.convertParams(form)).then(({data}) => {
          context.commit('alterConnGraphData', data.data);
          resolve();
        }).catch((err) => {
          reject(err);
        })
      })
    }
  }
}
