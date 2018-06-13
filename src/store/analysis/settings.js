export default {
  //初始状态
  state:{
    title:'基于邮件数据的可视化分析系统',
    showLoading: false,
    logoText:'基于邮件数据的可视化分析系统'
  },
  //获取器
  getters:{
    //页面读取数据
    showLoading:state=>state.showLoading,
    searchPlaceholder:state=>state.searchPlaceholder,
    appTitle:state=>state.title,
    logoText:state=>state.logoText
  },
  //突变
  mutations:{
    //数据修改操作
    alterShowLoading(state,data){
      state.showLoading = data;
    },
    alterTitle(state,data){
      state.title = data;
    }
  },
  //动作
  actions:{
    //向后台请求数据等操作
    setShowLoading({commit}, flag){
        context.commit('alterShowLoading',flag);
    },
    setTitle({commit}, title){
      context.commit('alterTitle', title);
    }
  }
}
