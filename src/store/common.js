export default {
    convertForm: function (form, param=[]) {
        let url = [];
        if(param.length <= 0){
            param = form
        }
        for(let i in param){
            if(form.hasOwnProperty(i)){
                form[param[i]] ? url.push(param[i] + '=' + form[param[i]]) : null
            }
        }
        return url
    },
    convertParams: function (form, param=[]) {
        let url = [];
        if(param.length <= 0){
            param = form
        }
        for(let i in param){
            if(form.hasOwnProperty(i)){
                form[i] ? url.push(i + '=' + form[i]) : null
            }
        }
        let params = url.join('&');
        params = params.length <= 0 ? '' : '?' + params;
        return params
    }
}
