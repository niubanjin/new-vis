import axios from '../axios'
import common from '../common'

export default {
  //初始状态
  state: {
    leftBottomOption: {
      title: {
        left: 'center',
        text: '内外部邮件折线图',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        textStyle: {
          color: '#fff'
        },
        left: 'right',
        data:['内部邮件', '外部邮件']
      },
      dataZoom: [
        {

        },{
          type: 'inside',
        }
      ],
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : [],
          axisLine: {
            lineStyle:{
              color: '#fff'
            }
          },
          axisLabel: {
            show: true
          }
        }
      ],
      yAxis : [
        {
          axisLine: {
            lineStyle:{
              color: '#fff'
            }
          },
          splitLine: {
            show:false
          },
          name: '邮件数量/封',
          type : 'value'
        }
      ],
      series : [
        {
          name:'内部邮件',
          type:'line',
          stack: '总量',
          data:[]
        },
        {
          name:'外部邮件',
          type:'line',
          stack: '总量',
          data:[]
        },
      ]
    },
    rightTopOption: {
      tooltip: {
        position: 'top'
      },
      xAxis: {
        type: 'category',
        data: []
      },
      yAxis: {
        type: 'category',
        data: []
      },
      visualMap: {
        min: 1,
        max: 10,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
        show:false
      },
      series: [{
        name: 'Punch Card',
        type: 'heatmap',
        data: [],
        label: {
          normal: {
            show: false
          }
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    },
    rightBottomOption: {},
    rightBottomData: [],
    leftBottomData: [],
    rightTopData: []
  },
  //获取器
  getters: {
    leftBottomOption:state => state.leftBottomOption,
    leftBottomData:state => state.leftBottomData,
    rightTopOption:state => state.rightTopOption,
    rightTopData:state => state.rightTopData,
    rightBottomOption:state => state.rightBottomOption,
    rightBottomData:state => state.rightBottomData
  },
  //突变
  mutations: {
    alterLeftBottomData(state, data){
      state.leftBottomData = data;
    },
    alterRightTopData(state, data){
      state.rightTopData = data;
    },
    alterRightBottomData(state, data){
      state.rightBottomData = data;
    },
  },
  //动作
  actions: {
    getLeftBottomData(context, form){
      return new Promise((resolve,reject)=>{
        axios.get('/api/line/' + common.convertParams(form)).then(({data})=>{
          if(data.code === 0){
            context.commit('alterLeftBottomData',data.data);
            resolve();
          }else{
            reject(data.message);
          }
        }).catch((error)=>{
          reject(error);
        });
      });
    },
    getRightTopData(context, form){
      return new Promise((resolve,reject)=>{
        axios.get('/api/heatmap/' + common.convertParams(form)).then(({data})=>{
          if(data.code === 0){
            context.commit('alterRightTopData',data.data);
            resolve();
          }else{
            reject(data.message);
          }
        }).catch((error)=>{
          reject(error);
        });
      });
    },
    getRightBottomData(context, form){
      return new Promise((resolve,reject)=>{
        axios.get('/api/heatmap/' + common.convertParams(form)).then(({data})=>{
          if(data.code === 0){
            context.commit('alterRightBottomData',data.data);
            resolve();
          }else{
            reject(data.message);
          }
        }).catch((error)=>{
          reject(error);
        });
      });
    },
  }
}
