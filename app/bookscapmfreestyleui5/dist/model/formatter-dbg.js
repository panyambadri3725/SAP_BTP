sap.ui.define([],function(){
    "use strict";
    return {
        // all condition function
        formatStatusIcon:function(val){
            debugger;
            switch (val){
                case "C" : return "sap-icon://accept";
                case "I" : return "sap-icon://pending";
                default : return "sap-icon://alert";
            }
        },
        formatStatusColor:function(col){
            switch(col){
                case "C" : return "Positive";
                case "I" : return "Critical";
                default : return "Negative";
            }
        },

        formatDate1 : function(date1){
            if(!date1) return "";
            return new Date(date1).toLocaleDateString();
        },
        formatDate2 : function(date2){
            if(!date2) return '';
            var d1 = sap.ui.core.format.DateFormat.getInstance({
                pattern : 'yyyy-MM-dd'
            });

            return d1.format(new Date(date2));
        },

        formatprice : function(pf){
            return "$" + Number(pf).toFixed(2)
        },
        priceBand : function(price1,agegroup1){
            
            if(price1 > 10 && agegroup1 ==='Kids') return price1-5;
            else return price1
        },
        priceBandColor: function(price1,agegroup1){
           
            if(price1 > 10 && agegroup1 ==='Kids') return 'Success';
            else return 'Error'
        },

        




    };
})