angular.module('clientApp', [])
    .filter('findobj', function () {
         return function (dataobj, multipleVlaue) {
             if (!multipleVlaue) return dataobj;
             if (multipleVlaue.length==0) return dataobj;
             return dataobj.filter(function (news) {
                 var tofilter = [];
             
				 angular.forEach(multipleVlaue,function(v,i){ 
                  tofilter.push(v);
                 });
				 
				 return news.CategoryList.some(function (category) {
                return tofilter.indexOf(category.DisplayName)>-1;
             });

             });
         };
     })