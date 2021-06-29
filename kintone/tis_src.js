/*
jTis-Plugin "tis.js"
Version: 1.0
Copyright (c) 2019 TIS
Released under the MIT License.
http://tis2010.jp/license.txt
*/
/*
Date extention
*/
Date.prototype.calc=function(pattern,ischain){
	var year=this.getFullYear();
	var month=this.getMonth()+1;
	var day=this.getDate();
	var datetime=new Date(this.getTime());
	//add hour
	if (pattern.match(/^-?[0-9]+ hour/g)!=null) return new Date(datetime.setHours(datetime.getHours()+parseInt(pattern.match(/^-?[0-9]+/g))));
	//add minute
	if (pattern.match(/^-?[0-9]+ minute/g)!=null) return new Date(datetime.setMinutes(datetime.getMinutes()+parseInt(pattern.match(/^-?[0-9]+/g))));
	//add second
	if (pattern.match(/^-?[0-9]+ second/g)!=null) return new Date(datetime.setSeconds(datetime.getSeconds()+parseInt(pattern.match(/^-?[0-9]+/g))));
	//add years
	if (pattern.match(/^-?[0-9]+ year$/g)!=null) year+=parseInt(pattern.match(/^-?[0-9]+/g));
	//add months
	if (pattern.match(/^-?[0-9]+ month$/g)!=null)
	{
		month+=parseInt(pattern.match(/^-?[0-9]+/g));
		//check of next year
		while (month<1) {year--;month+=12;}
		while (month>12) {year++;month-=12;}
		//check of next month
		var check=new Date(year.toString()+'/'+month.toString()+'/'+day.toString());
		if (check.getMonth()+1!=month)
		{
			check=new Date(year.toString()+'/'+(month+1).toString()+'/1');
			check.setDate(0);
			day=check.getDate();
		}
	}
	//add day
	if (pattern.match(/^-?[0-9]+ day$/g)!=null) day+=parseInt(pattern.match(/^-?[0-9]+/g));
	//first day of year
	if (pattern.match(/^first-of-year$/g)!=null) {month=1;day=1};
	//first day of month
	if (pattern.match(/^first-of-month$/g)!=null) day=1;
	//first day of week
	if (pattern.match(/^first-of-week$/g)!=null) day-=this.getDay();
	if (month<1){year--;month=12;}
	if (month>12){year++;month=1;}
	if (ischain) return new Date(year,(month-1),day,datetime.getHours(),datetime.getMinutes(),datetime.getSeconds());
	else return new Date(year,(month-1),day);
};
Date.prototype.format=function(pattern){
	var year=this.getFullYear().toString();
	var month=('0'+(this.getMonth()+1)).slice(-2);
	var day=('0'+this.getDate()).slice(-2);
	var hour=('0'+this.getHours()).slice(-2);
	var minute=('0'+this.getMinutes()).slice(-2);
	var second=('0'+this.getSeconds()).slice(-2);
	//iso 8601
	if (pattern.match(/^ISO$/g)) return this.toISOString().replace(/[0-9]{2}\.[0-9]{3}Z$/g,'00Z');
	//iso 8601
	if (pattern.match(/^ISOSEC$/g)) return this.toISOString().replace(/\.[0-9]{3}Z$/g,'Z');
	//Japanese
	if (pattern.match(/^ja$/g)!=null)
	{
		var era='';
		if (year>2018)
		{
			era='令和';
			year-=2018;
		}
		else if (year>1988)
		{
			era='平成';
			year-=1988;
		}
		else if (year>1925)
		{
			era='昭和';
			year-=1925;
		}
		else if (year>1911)
		{
			era='大正';
			year-=1911;
		}
		else if (year>1867)
		{
			era='明治';
			year-=1867;
		}
		return era+('0'+year).slice(-2)+'年'+month+'月'+day+'日';
	}
	//second
	pattern=pattern.replace(/ss/g,second);
	pattern=pattern.replace(/s/g,second);
	//minute
	pattern=pattern.replace(/mm/g,minute);
	pattern=pattern.replace(/i/g,minute);
	//hour
	pattern=pattern.replace(/(HH|hh)/g,hour);
	pattern=pattern.replace(/(H|h)/g,hour);
	//day
	pattern=pattern.replace(/(DD|dd)/g,day);
	pattern=pattern.replace(/(D|d)/g,day);
	//month
	pattern=pattern.replace(/MM/g,month);
	pattern=pattern.replace(/(M|m)/g,month);
	//year
	pattern=pattern.replace(/(YYYY|yyyy)/g,year);
	pattern=pattern.replace(/(YY|yy)/g,year.slice(-2));
	pattern=pattern.replace(/(Y|y)/g,year);
	return pattern;
}
String.prototype.dateformat=function(){
	if (this.length!=0)
	{
		var format=(this.match(/T/g))?this.replace(/\//g,'-'):this.replace(/-/g,'\/');
		if (this.match(/\+/g)) format=format.split('+')[0]+'+'+format.split('+')[1].replace(/[^0-9]+/g,'');
		if (isNaN(Date.parse(format))) format=format.replace(/-/g,'\/').replace(/T/g,' ').replace(/Z/g,'');
		var date=new Date(format);
		date.setHours(date.getHours());
		var year=date.getFullYear();
		var month=('0'+(date.getMonth()+1)).slice(-2);
		var day=('0'+date.getDate()).slice(-2);
		var hour=('0'+date.getHours()).slice(-2);
		var minute=('0'+date.getMinutes()).slice(-2);
		var second=('0'+date.getSeconds()).slice(-2);
		return year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
	}
	else return '';
};
/*
Number extention
*/
Number.prototype.comma=function(){
	return Number(String(this).replace(',','')).toLocaleString();
};
Number.prototype.format=function(digit){
	var res=String(this);
	if (digit)
	{
		res=this.toFixed(parseInt(digit)).split('.');
		res[0]=res[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1,');
		res=(parseFloat(res.join('.')))?res.join('.'):res.join('.').replace(/^-/g,'');
	}
	else res=res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1,');
	return res;
};
/*
String extention
*/
String.prototype.lpad=function(pattern,length){
	var padding='';
	for (var i=0;i<length;i++) padding+=pattern;
	return (padding+this).slice(length*-1);
};
String.prototype.rpad=function(pattern,length){
	var padding='';
	for (var i=0;i<length;i++) padding+=pattern;
	return (this+padding).slice(0,length);
};
/*
Event For TIS Plugins
*/
var tiseventlibrary=function(){
	var me=this;
	me.eventlisteners={};
}
tiseventlibrary.prototype={
	on:function(type,listener){
		if (!type) return;
		if (!listener) return;
		var me=this;
		var types=(!Array.isArray(type))?type.split(','):type;
		for (var i=0;i<types.length;i++)
		{
			if (!(types[i] in me.eventlisteners)) me.eventlisteners[types[i]]=[];
			me.eventlisteners[types[i]].push(listener);
		}
	},
	off:function(type){
		if (!type) return;
		var me=this;
		var types=type.split(',');
		for (var i=0;i<types.length;i++)
			if (types[i] in me.eventlisteners) delete me.eventlisteners[types[i]];
	},
	trigger:function(type,param){
		var me=this;
		var call=function(index,param,callback){
			var listener=me.eventlisteners[type][index];
			var promise=function(listener,param){
				return new Promise(function(resolve,reject){
					resolve(listener(param));
				});
			};
			promise(listener,param).then(function(resp){
				if (resp) param=resp;
				if (!param.error)
				{
					index++;
					if (index<me.eventlisteners[type].length) call(index,param,callback);
					else callback(param);
				}
				else callback(param);
			});
		};
		if (!param) param={};
		return new Promise(function(resolve,reject){
			param['type']=type;
			param['error']=false;
			if (type in me.eventlisteners)
			{
				if (me.eventlisteners[type].length!=0)
				{
					call(0,param,function(param){
						resolve(param);
					});
				}
				else resolve(param);
			}
			else resolve(param);
		});
	}
};
var tisevent=new tiseventlibrary();
(function($){
var div=$('<div>').css({
	'box-sizing':'border-box',
	'margin':'0px',
	'padding':'0px',
	'position':'relative',
	'vertical-align':'top'
});
var span=$('<span>').css({
	'box-sizing':'border-box',
	'display':'inline-block',
	'line-height':'30px',
	'margin':'0px',
	'padding':'0px 5px',
	'vertical-align':'top'
});
var button=$('<button>').css({
	'background-color':'transparent',
	'border':'none',
	'border-radius':'3px',
	'box-sizing':'border-box',
	'color':'#FFFFFF',
	'cursor':'pointer',
	'font-size':'13px',
	'height':'30px',
	'line-height':'30px',
	'margin':'0px 3px',
	'outline':'none',
	'padding':'0px 1em',
	'vertical-align':'top',
	'width':'auto'
});
var cell=$('<td>').css({
	'border':'1px solid #C9C9C9',
	'cursor':'pointer'
});
var checkbox=$('<label>').css({
	'box-sizing':'border-box',
	'display':'inline-block',
	'line-height':'30px',
	'margin':'0px',
	'padding':'0px',
	'vertical-align':'top'
})
.append($('<input type="checkbox" class="receiver">'))
.append(span.clone(true).addClass('label').css({'padding':'0px 10px 0px 5px'}));
var radio=$('<label>').css({
	'box-sizing':'border-box',
	'display':'inline-block',
	'line-height':'30px',
	'margin':'0px',
	'padding':'0px',
	'vertical-align':'top'
})
.append($('<input type="radio" class="receiver">'))
.append(span.clone(true).addClass('label').css({'padding':'0px 10px 0px 5px'}));
var referer=div.clone(true).css({
	'display':'inline-block',
	'line-height':'30px',
	'width':'100%'
})
.append(
	span.clone(true).addClass('label').css({
		'overflow':'hidden',
		'padding-left':'70px',
		'text-overflow':'ellipsis',
		'white-space':'nowrap',
		'width':'100%'
	})
)
.append($('<input type="hidden" class="receiver">'))
.append($('<input type="hidden" class="key">'))
.append($('<input type="hidden" class="picker">'))
.append(
	button.clone(true).addClass('search').css({
		'left':'0px',
		'margin':'0px',
		'padding':'0px',
		'position':'absolute',
		'top':'0px',
		'width':'30px'
	})
	.append($('<img src="https://tis2010.jp/library/kintone/images/search.png">').css({'width':'100%'}))
)
.append(
	button.clone(true).addClass('clear').css({
		'left':'35px',
		'margin':'0px',
		'padding':'0px',
		'position':'absolute',
		'top':'0px',
		'width':'30px'
	})
	.append($('<img src="https://tis2010.jp/library/kintone/images/close.png">').css({'width':'100%'}))
);
var select=$('<select>').css({
	'border':'1px solid #C9C9C9',
	'border-radius':'3px',
	'box-sizing':'border-box',
	'display':'inline-block',
	'height':'30px',
	'line-height':'30px',
	'margin':'0px',
	'padding':'0px 5px',
	'vertical-align':'top',
	'width':'auto'
});
var textarea=$('<textarea>').css({
	'border':'1px solid #C9C9C9',
	'border-radius':'3px',
	'box-sizing':'border-box',
	'display':'block',
	'height':'calc(7.5em + 10px)',
	'line-height':'1.5em',
	'padding':'5px',
	'vertical-align':'top',
	'width':'100%'
});
var textline=$('<input type="text">').css({
	'border':'1px solid #C9C9C9',
	'border-radius':'3px',
	'box-sizing':'border-box',
	'display':'inline-block',
	'height':'30px',
	'line-height':'30px',
	'padding':'0px 5px',
	'vertical-align':'top',
	'width':'100%'
});
var time=div.clone(true).css({
	'display':'inline-block',
	'line-height':'30px'
})
.append(select.clone(true).addClass('receiverhour'))
.append(span.clone(true).text('：'))
.append(select.clone(true).addClass('receiverminute'));
for (var i=0;i<24;i++) $('.receiverhour',time).append($('<option>').attr('value',('0'+i.toString()).slice(-2)).text(('0'+i.toString()).slice(-2)));
for (var i=0;i<60;i++) $('.receiverminute',time).append($('<option>').attr('value',('0'+i.toString()).slice(-2)).text(('0'+i.toString()).slice(-2)));
var title=$('<label class="title">').css({
	'box-sizing':'border-box',
	'border-left':'5px solid #3498db',
	'display':'block',
	'line-height':'25px',
	'margin':'5px 0px',
	'padding':'0px',
	'padding-left':'5px'
});
var createdialog=function(type,height,width){
	var res={};
	switch (type)
	{
		case 'standard':
			res={
				cover:div.clone(true).css({
					'background-color':'rgba(0,0,0,0.5)',
					'display':'none',
					'height':'100%',
					'left':'0px',
					'position':'fixed',
					'top':'0px',
					'width':'100%',
					'z-index':'999999'
				}),
				container:div.clone(true).css({
					'background-color':'#FFFFFF',
					'bottom':'0',
					'border-radius':'5px',
					'box-shadow':'0px 0px 3px rgba(0,0,0,0.35)',
					'height':height+'px',
					'left':'0',
					'margin':'auto',
					'max-height':'calc(100% - 1em)',
					'max-width':'calc(100% - 1em)',
					'padding':'5px 5px 40px 5px',
					'position':'absolute',
					'right':'0',
					'top':'0',
					'width':width+'px'
				}),
				contents:div.clone(true).css({
					'height':'100%',
					'margin':'0px',
					'overflow':'auto',
					'padding':'5px 5px 10px 5px',
					'position':'relative',
					'text-align':'left',
					'width':'100%',
					'z-index':'1'
				}),
				header:div.clone(true).css({
					'background-color':'#3498db',
					'border-top-left-radius':'5px',
					'border-top-right-radius':'5px',
					'left':'0px',
					'padding':'5px',
					'position':'absolute',
					'text-align':'left',
					'top':'0px',
					'width':'100%',
					'z-index':'3'
				})
				.append(div.clone(true).css({
					'display':'inline-block',
					'vertical-align':'top',
					'width':'100%',
				}).addClass('main'))
				.append(div.clone(true).css({
					'display':'inline-block',
					'vertical-align':'top',
					'width':'0px',
				}).addClass('sub')),
				footer:div.clone(true).css({
					'background-color':'#3498db',
					'border-bottom-left-radius':'5px',
					'border-bottom-right-radius':'5px',
					'bottom':'0px',
					'left':'0px',
					'padding':'5px',
					'position':'absolute',
					'text-align':'center',
					'width':'100%',
					'z-index':'3'
				}),
				lists:$('<table>').css({
					'box-sizing':'border-box',
					'width':'100%'
				}).append($('<tbody>'))
			};
			break;
		case 'dark':
			res={
				button:$('<img>').css({
					'background-color':'transparent',
					'border':'none',
					'border-radius':'50%',
					'box-sizing':'border-box',
					'cursor':'pointer',
					'display':'inline-block',
					'height':'3em',
					'margin':'0px',
					'vertical-align':'top',
					'width':'3em'
				}),
				cover:div.clone(true).css({
					'background-color':'rgba(0,0,0,0.5)',
					'display':'none',
					'height':'100%',
					'left':'0px',
					'position':'fixed',
					'top':'0px',
					'width':'100%',
					'z-index':'999999'
				}),
				container:div.clone(true).css({
					'background-color':'rgba(0,0,0,0.5)',
					'bottom':'0',
					'border-radius':'1em',
					'box-shadow':'0px 0px 3px rgba(0,0,0,0.35)',
					'height':'calc(100% - 2em)',
					'left':'0',
					'margin':'auto',
					'padding':'0.5em 1em 1em 1em',
					'position':'absolute',
					'right':'0',
					'top':'0',
					'width':'calc(100% - 2em)'
				}),
				contents:div.clone(true).css({
					'height':'calc(100% - 3.5em)',
					'margin-top':'0.5em',
					'padding':'0',
					'position':'relative',
					'text-align':'center',
					'width':'100%'
				}),
				header:div.clone(true).css({
					'margin':'0',
					'padding':'0',
					'text-align':'right',
					'width':'100%'
				})
			};
			break;
	}
	return res;
};
/*
jTis namespace extention
*/
jTis.extend({
	breadcrumbsparams:function(){
		var res='';
		var query=(location.search)?encodeURI(location.search.substring(1)):((location.href.match(/show#/g))?location.href.replace(/^[^&]+&/g,'&'):'');
		query=query.replace(/&tab=none/g,'').replace(/&mode=edit/g,'').replace(/&mode=show/g,'').replace(/&&/g,'&').replace(/&l./g,'&');
		if (query.match(/^&/g)) query=query.replace(/^&/g,'');
		if (query) res=('&'+query).replace(/&/g,'&l.');
		return res;
	},
	builderror:function(error){
		var res=[];
		res.push(error.message);
		if ('errors' in error)
			$.each(error.errors,function(key,values){
				res.push(key.replace(/^record\./g,'').replace(/\.value(\[[0-9]+\]|)/g,'')+':'+values.messages.join(','));
			});
		return res.join('\n');
	},
	calculatetax:function(options){
		var options=$.extend(true,{
			able:0,
			normal:null,
			reduced:null,
			free:0,
			isoutsidetax:true,
			taxround:'round',
			taxrate:0,
			taxrates:{}
		},options);
		var tax=0;
		var normaltax=0;
		var reducedtax=0;
		if (options.normal!=null)
		{
			if (options.isoutsidetax)
			{
				//outside
				switch (options.taxround)
				{
					case 'floor':
						options.normal=Math.floor(options.normal*(1+options.taxrates.normalrate));
						normaltax=Math.floor((options.normal*options.taxrates.normalrate*100)/(100+(options.taxrates.normalrate*100)));
						options.reduced=Math.floor(options.reduced*(1+options.taxrates.reducedrate));
						reducedtax=Math.floor((options.reduced*options.taxrates.reducedrate*100)/(100+(options.taxrates.reducedrate*100)));
						break;
					case 'ceil':
						options.normal=Math.ceil(options.normal*(1+options.taxrates.normalrate));
						normaltax=Math.ceil((options.normal*options.taxrates.normalrate*100)/(100+(options.taxrates.normalrate*100)));
						options.reduced=Math.ceil(options.reduced*(1+options.taxrates.reducedrate));
						reducedtax=Math.ceil((options.reduced*options.taxrates.reducedrate*100)/(100+(options.taxrates.reducedrate*100)));
						break;
					case 'round':
						options.normal=Math.round(options.normal*(1+options.taxrates.normalrate));
						normaltax=Math.round((options.normal*options.taxrates.normalrate*100)/(100+(options.taxrates.normalrate*100)));
						options.reduced=Math.round(options.reduced*(1+options.taxrates.reducedrate));
						reducedtax=Math.round((options.reduced*options.taxrates.reducedrate*100)/(100+(options.taxrates.reducedrate*100)));
						break;
				}
			}
			else
			{
				//inside
				switch (options.taxround)
				{
					case 'floor':
						options.normal=Math.floor(options.normal);
						normaltax=Math.floor((options.normal*options.taxrates.normalrate*100)/(100+(options.taxrates.normalrate*100)));
						options.reduced=Math.floor(options.reduced);
						reducedtax=Math.floor((options.reduced*options.taxrates.reducedrate*100)/(100+(options.taxrates.reducedrate*100)));
						break;
					case 'ceil':
						options.normal=Math.ceil(options.normal);
						normaltax=Math.ceil((options.normal*options.taxrates.normalrate*100)/(100+(options.taxrates.normalrate*100)));
						options.reduced=Math.ceil(options.reduced);
						reducedtax=Math.ceil((options.reduced*options.taxrates.reducedrate*100)/(100+(options.taxrates.reducedrate*100)));
						break;
					case 'round':
						options.normal=Math.round(options.normal);
						normaltax=Math.round((options.normal*options.taxrates.normalrate*100)/(100+(options.taxrates.normalrate*100)));
						options.reduced=Math.round(options.reduced);
						reducedtax=Math.round((options.reduced*options.taxrates.reducedrate*100)/(100+(options.taxrates.reducedrate*100)));
						break;
				}
			}
			switch (options.taxround)
			{
				case 'floor':
					options.free=Math.floor(options.free);
					break;
				case 'ceil':
					options.free=Math.ceil(options.free);
					break;
				case 'round':
					options.free=Math.round(options.free);
					break;
			}
			return {
				able:options.normal+options.reduced,
				free:options.free,
				subtotal:options.normal-normaltax+options.reduced-reducedtax+options.free,
				tax:normaltax+reducedtax,
				total:options.normal+options.reduced+options.free,
				normaltotal:options.normal-normaltax,
				reducedtotal:options.reduced-reducedtax,
				normaltax:normaltax,
				reducedtax:reducedtax
			}
		}
		else
		{
			if (options.isoutsidetax)
			{
				//outside
				switch (options.taxround)
				{
					case 'floor':
						options.able=Math.floor(options.able*(1+options.taxrate));
						tax=Math.floor((options.able*options.taxrate*100)/(100+(options.taxrate*100)));
						break;
					case 'ceil':
						options.able=Math.ceil(options.able*(1+options.taxrate));
						tax=Math.ceil((options.able*options.taxrate*100)/(100+(options.taxrate*100)));
						break;
					case 'round':
						options.able=Math.round(options.able*(1+options.taxrate));
						tax=Math.round((options.able*options.taxrate*100)/(100+(options.taxrate*100)));
						break;
				}
			}
			else
			{
				//inside
				switch (options.taxround)
				{
					case 'floor':
						options.able=Math.floor(options.able);
						tax=Math.floor((options.able*options.taxrate*100)/(100+(options.taxrate*100)));
						break;
					case 'ceil':
						options.able=Math.ceil(options.able);
						tax=Math.ceil((options.able*options.taxrate*100)/(100+(options.taxrate*100)));
						break;
					case 'round':
						options.able=Math.round(options.able);
						tax=Math.round((options.able*options.taxrate*100)/(100+(options.taxrate*100)));
						break;
				}
			}
			switch (options.taxround)
			{
				case 'floor':
					options.free=Math.floor(options.free);
					break;
				case 'ceil':
					options.free=Math.ceil(options.free);
					break;
				case 'round':
					options.free=Math.round(options.free);
					break;
			}
			return {able:options.able,tax:tax,free:options.free}
		}
	},
	calculatetaxrate:function(date){
		var rates=$.calculatetaxrates(date);
		return parseFloat(rates.normalrate);
	},
	calculatetaxrates:function(date){
		var tax=[
			{startdate:'1900-01-01',normalrate:0,reducedrate:0},
			{startdate:'1989-04-01',normalrate:0.03,reducedrate:0.03},
			{startdate:'1997-04-01',normalrate:0.05,reducedrate:0.05},
			{startdate:'2014-04-01',normalrate:0.08,reducedrate:0.08},
			{startdate:'2019-10-01',normalrate:0.1,reducedrate:0.08}
		];
		var res={};
		var today=new Date().format('Y/m/d');
		for (var i=0;i<tax.length;i++) if (new Date(tax[i].startdate.replace(/-/g,'\/')).calc('-1 day')<date) res=tax[i];
		return res;
	},
	conditionsmatch:function(record,fieldinfos,conditions,byref){
		var res=(byref)?(function(){
			var res={};
			for (var key in record) res[key]=record[key];
			return res;
		})():$.extend(true,{},record);
		var ismatch=function(value,condition,fieldinfo){
			var match=true;
			var isdatematch=function(value,condition,isdatetime){
				var res=true;
				var firstday=new Date();
				var lastday=new Date();
				switch (condition.value)
				{
					case 'NOW':
						firstday=new Date();
						lastday=new Date();
						break;
					case 'TODAY':
						firstday=new Date(new Date().format('Y-m-d')+'T00:00:00'+$.timezome());
						lastday=new Date(new Date().format('Y-m-d')+'T23:59:59'+$.timezome());
						break;
					case 'LASTWEEK':
						firstday=new Date(new Date().calc('first-of-week').calc('-7 day').format('Y-m-d')+'T00:00:00'+$.timezome());
						lastday=new Date(new Date().calc('first-of-week').calc('-1 day').format('Y-m-d')+'T23:59:59'+$.timezome());
						break;
					case 'THISWEEK':
						firstday=new Date(new Date().calc('first-of-week').format('Y-m-d')+'T00:00:00'+$.timezome());
						lastday=new Date(new Date().calc('first-of-week').calc('6 day').format('Y-m-d')+'T23:59:59'+$.timezome());
						break;
					case 'LASTMONTH':
						firstday=new Date(new Date().calc('first-of-month').calc('-1 month').format('Y-m-d')+'T00:00:00'+$.timezome());
						lastday=new Date(new Date().calc('first-of-month').calc('-1 day').format('Y-m-d')+'T23:59:59'+$.timezome());
						break;
					case 'THISMONTH':
						firstday=new Date(new Date().calc('first-of-month').format('Y-m-d')+'T00:00:00'+$.timezome());
						lastday=new Date(new Date().calc('first-of-month').calc('1 month').calc('-1 day').format('Y-m-d')+'T23:59:59'+$.timezome());
						break;
					case 'THISYEAR':
						firstday=new Date(new Date().calc('first-of-year').format('Y-m-d')+'T00:00:00'+$.timezome());
						lastday=new Date(new Date().calc('first-of-year').calc('1 year').calc('-1 day').format('Y-m-d')+'T23:59:59'+$.timezome());
						break;
					default:
						if (condition.value)
						{
							if (condition.value.match(/^FROM/g))
							{
								var pattern=condition.value.replace(/-?[0-9]+(d|m|y)$/g,'');
								var span=condition.value.replace(pattern,'').replace(/[^0-9-]+/g,'');
								var unit=(function(unit){
									var res='';
									switch (unit)
									{
										case 'd':
											res='day';
											break;
										case 'm':
											res='month';
											break;
										case 'y':
											res='year';
											break;
									}
									return res;
								})(condition.value.slice(-1));
								switch (pattern)
								{
									case 'FROMTODAY':
										firstday=new Date(new Date().format('Y-m-d')+'T00:00:00'+$.timezome()).calc(span.toString()+' '+unit);
										lastday=new Date(new Date().format('Y-m-d')+'T00:00:00'+$.timezome()).calc(span.toString()+' '+unit);
										break;
									case 'FROMTHISMONTH':
										firstday=new Date(new Date().calc('first-of-month').format('Y-m-d')+'T00:00:00'+$.timezome()).calc(span.toString()+' '+unit);
										lastday=new Date(new Date().calc('first-of-month').format('Y-m-d')+'T00:00:00'+$.timezome()).calc(span.toString()+' '+unit);
										break;
									case 'FROMTHISYEAR':
										firstday=new Date(new Date().calc('first-of-year').format('Y-m-d')+'T00:00:00'+$.timezome()).calc(span.toString()+' '+unit);
										lastday=new Date(new Date().calc('first-of-year').format('Y-m-d')+'T00:00:00'+$.timezome()).calc(span.toString()+' '+unit);
										break;
								}
							}
							else
							{
								firstday=new Date(condition.value.dateformat());
								lastday=new Date(condition.value.dateformat());
							}
						}
						break;
				}
				switch (condition.comp.code)
				{
					case '0':
						if (!value)
						{
							if (condition.value) res=false;
						}
						else
						{
							if (condition.value)
							{
								if (new Date(value.dateformat())<firstday) res=false;
								if (new Date(value.dateformat())>lastday) res=false;
							}
							else res=false;
						}
						break;
					case '1':
						if (!value)
						{
							if (!condition.value) res=false;
						}
						else
						{
							if (condition.value)
								if (new Date(value.dateformat())>=firstday && new Date(value.dateformat())<=lastday) res=false;
						}
						break;
					case '2':
						if (!value) res=false;
						else
						{
							if (new Date(value.dateformat())>lastday) res=false;
						}
						break;
					case '3':
						if (!value) res=false;
						else
						{
							if (new Date(value.dateformat())>=firstday) res=false;
						}
						break;
					case '4':
						if (!value) res=false;
						else
						{
							if (new Date(value.dateformat())<firstday) res=false;
						}
						break;
					case '5':
						if (!value) res=false;
						else
						{
							if (new Date(value.dateformat())<=lastday) res=false;
						}
						break;
				}
				return res;
			};
			switch (fieldinfo.type)
			{
				case 'CALC':
					switch(fieldinfo.format.toUpperCase())
					{
						case 'NUMBER':
						case 'NUMBER_DIGIT':
							switch (condition.comp.code)
							{
								case '0':
									if (!value) value='';
									if (value!=condition.value) match=false;
									break;
								case '1':
									if (!value) value='';
									if (value==condition.value) match=false;
									break;
								case '2':
									if (!value) match=false;
									else
									{
										if (parseFloat(value)>parseFloat(condition.value)) match=false;
									}
									break;
								case '3':
									if (!value) match=false;
									else
									{
										if (parseFloat(value)<parseFloat(condition.value)) match=false;
									}
									break;
							}
							break;
						case 'DATE':
						case 'DATETIME':
						case 'DAY_HOUR_MINUTE':
							match=isdatematch(value,condition,(fieldinfo.format.toUpperCase()!='DATE'));
							break;
						case 'HOUR_MINUTE':
						case 'TIME':
							var date=new Date().format('Y-m-d')+' ';
							switch (condition.comp.code)
							{
								case '0':
									if (!value) value='';
									if (value!=condition.value) match=false;
									break;
								case '1':
									if (!value) value='';
									if (value==condition.value) match=false;
									break;
								case '2':
									if (!value) match=false;
									else
									{
										if (new Date(date+value+':00')>new Date(date+condition.value+':00')) match=false;
									}
									break;
								case '3':
									if (!value) match=false;
									else
									{
										if (new Date(date+value+':00')>=new Date(date+condition.value+':00')) match=false;
									}
									break;
								case '4':
									if (!value) match=false;
									else
									{
										if (new Date(date+value+':00')<new Date(date+condition.value+':00')) match=false;
									}
									break;
								case '5':
									if (!value) match=false;
									else
									{
										if (new Date(date+value+':00')<=new Date(date+condition.value+':00')) match=false;
									}
									break;
							}
							break;
					}
					break;
				case 'CHECK_BOX':
				case 'MULTI_SELECT':
					var hit=0;
					for (var i2=0;i2<value.length;i2++) if (condition.value.indexOf(value[i2])>-1) hit++;
					switch (condition.comp.code)
					{
						case '0':
							if (hit<1) match=false;
							break;
						case '1':
							if (hit>0) match=false;
							break;
					}
					break;
				case 'DROP_DOWN':
				case 'RADIO_BUTTON':
				case 'STATUS':
					if (!value) value='';
					switch (condition.comp.code)
					{
						case '0':
							if (condition.value.indexOf(value)<0) match=false;
							break;
						case '1':
							if (condition.value.indexOf(value)>-1) match=false;
							break;
					}
					break;
				case 'CREATED_TIME':
				case 'DATE':
				case 'DATETIME':
				case 'UPDATED_TIME':
					match=isdatematch(value,condition,(fieldinfo.type!='DATE'));
					break;
				case 'GROUP_SELECT':
				case 'ORGANIZATION_SELECT':
				case 'USER_SELECT':
					var hit=0;
					for (var i2=0;i2<condition.value.length;i2++) if (condition.value[i2]=='LOGINUSER') condition.value[i2]=kintone.getLoginUser().code;
					hit=$.grep(value,function(item,index){
						return condition.value.indexOf(item.code)>-1;
					}).length;
					switch (condition.comp.code)
					{
						case '0':
							if (hit<1) match=false;
							break;
						case '1':
							if (hit>0) match=false;
							break;
					}
					break;
				case 'LINK':
				case 'SINGLE_LINE_TEXT':
					if (!value) value='';
					switch (condition.comp.code)
					{
						case '0':
							if (value!=condition.value) match=false;
							break;
						case '1':
							if (value==condition.value) match=false;
							break;
						case '2':
							if (!value.match(new RegExp(condition.value.replace(/[\/\\^$*+?.()|\[\]{}]/g,'\\$&'),'g'))) match=false;
							break;
						case '3':
							if (value.match(new RegExp(condition.value.replace(/[\/\\^$*+?.()|\[\]{}]/g,'\\$&'),'g'))) match=false;
							break;
					}
					break;
				case 'MULTI_LINE_TEXT':
				case 'RICH_TEXT':
					if (!value) value='';
					switch (condition.comp.code)
					{
						case '0':
							if (!condition.value)
							{
								if (value) match=false;
							}
							else
							{
								if (!value.match(new RegExp(condition.value.replace(/[\/\\^$*+?.()|\[\]{}]/g,'\\$&'),'g'))) match=false;
							}
							break;
						case '1':
							if (!condition.value)
							{
								if (!value) match=false;
							}
							else
							{
								if (value.match(new RegExp(condition.value.replace(/[\/\\^$*+?.()|\[\]{}]/g,'\\$&'),'g'))) match=false;
							}
							break;
					}
					break;
				case 'NUMBER':
				case 'RECORD_NUMBER':
					switch (condition.comp.code)
					{
						case '0':
							if (!value) value='';
							if (value!=condition.value) match=false;
							break;
						case '1':
							if (!value) value='';
							if (value==condition.value) match=false;
							break;
						case '2':
							if (!value) match=false;
							else
							{
								if (parseFloat(value)>parseFloat(condition.value)) match=false;
							}
							break;
						case '3':
							if (!value) match=false;
							else
							{
								if (parseFloat(value)<parseFloat(condition.value)) match=false;
							}
							break;
					}
					break;
				case 'CREATOR':
				case 'MODIFIER':
				case 'STATUS_ASSIGNEE':
					switch (condition.comp.code)
					{
						case '0':
							if (condition.value.indexOf((value.code)?value.code:'')<0) match=false;
							break;
						case '1':
							if (condition.value.indexOf((value.code)?value.code:'')>-1) match=false;
							break;
					}
					break;
				case 'TIME':
					var date=new Date().format('Y-m-d')+' ';
					switch (condition.comp.code)
					{
						case '0':
							if (!value) value='';
							if (value!=condition.value) match=false;
							break;
						case '1':
							if (!value) value='';
							if (value==condition.value) match=false;
							break;
						case '2':
							if (!value) match=false;
							else
							{
								if (new Date(date+value+':00')>new Date(date+condition.value+':00')) match=false;
							}
							break;
						case '3':
							if (!value) match=false;
							else
							{
								if (new Date(date+value+':00')>=new Date(date+condition.value+':00')) match=false;
							}
							break;
						case '4':
							if (!value) match=false;
							else
							{
								if (new Date(date+value+':00')<new Date(date+condition.value+':00')) match=false;
							}
							break;
						case '5':
							if (!value) match=false;
							else
							{
								if (new Date(date+value+':00')<=new Date(date+condition.value+':00')) match=false;
							}
							break;
					}
					break;
			}
			return match;
		};
		for (var i=0;i<conditions.length;i++)
		{
			var condition=conditions[i];
			if (!condition.comp.code) continue;
			if (condition.field in fieldinfos)
			{
				var fieldinfo=fieldinfos[condition.field];
				if (fieldinfo)
				{
					if (fieldinfo.tablecode)
					{
						if (fieldinfo.tablecode in res)
						{
							res[fieldinfo.tablecode]={value:$.grep(res[fieldinfo.tablecode].value,function(item,index){
								return (!ismatch(item.value[fieldinfo.code].value,condition,fieldinfo))?false:true;
							})};
							if (res[fieldinfo.tablecode].value.length==0) return false;
						}
						else return false;
					}
					else
					{
						if (fieldinfo.code in record)
						{
							if (!ismatch(record[fieldinfo.code].value,condition,fieldinfo)) return false;
						}
						else return false;
					}
				}
			}
		}
		return res;
	},
	cursorcreate:function(options,callback){
		var options=$.extend(true,{
			fields:[],
			query:'',
			sort:'$id asc',
			size:500
		},options);
		var body={
			app:options.app,
			query:options.query+' order by '+options.sort.replace(/ limit .*$/g,'').replace(/ offset .*$/g,''),
			size:options.size
		};
		if (options.fields.length!=0) body['fields']=options.fields;
		kintone.api(kintone.api.url('/k/v1/records/cursor',true),'POST',body,function(resp){
			callback(resp.id,resp.totalCount);
		},function(error){
			callback(null,null,$.builderror(error));
		});
	},
	cursordelete:function(id,callback){
		kintone.api(kintone.api.url('/k/v1/records/cursor',true),'DELETE',{id:id},function(resp){
			callback();
		},function(error){
			callback($.builderror(error));
		});
	},
	cursorfetch:function(id,all,callback){
		var res=[];
		var fetch=function(callback){
			kintone.api(kintone.api.url('/k/v1/records/cursor',true),'GET',{id:id},function(resp){
				Array.prototype.push.apply(res,resp.records);
				if (all)
				{
					if (resp.next) fetch(callback);
					else callback();
				}
				else callback();
			},function(error){
				callback($.builderror(error));
			});
		};
		fetch(function(error){
			callback(res,error);
		});
	},
	createheadercontrol:function(options){
		var options=$.extend(true,{
			type:'',
			class:'',
			event:'',
			height:0,
			label:'',
			margin:'',
			place:'',
			width:'',
			options:[]
		},options);
		var res=null;
		var container=null;
		var ismobile=false;
		switch (options.event)
		{
			case 'app.record.index.show':
				options.height='48px';
				options.margin='0px 6px 0px 0px';
				options.width='auto';
				container=$(kintone.app.getHeaderMenuSpaceElement());
				break;
			case 'app.record.detail.show':
				options.height='40px';
				options.margin='3px 6px 0px 0px';
				options.width='auto';
				if (options.place) container=$(kintone.app.record.getSpaceElement(options.place));
				if (!container) container=$('.gaia-argoui-app-toolbar-statusmenu');
				break;
			case 'app.record.create.show':
			case 'app.record.edit.show':
				options.height='48px';
				options.margin='0px 0px 0px 16px';
				options.width='auto';
				if (options.place) container=$(kintone.app.record.getSpaceElement(options.place));
				if (!container) container=$('.gaia-argoui-app-edit-buttons');
				break;
			case 'mobile.app.record.index.show':
			case 'mobile.app.record.detail.show':
			case 'mobile.app.record.create.show':
			case 'mobile.app.record.edit.show':
				options.height='3em';
				options.margin='.25em .5em';
				options.width='calc(100% - 1em)';
				if (options.place) container=$(kintone.mobile.app.record.getSpaceElement(options.place));
				if (!container) container=$(kintone.mobile.app.getHeaderSpaceElement());
				ismobile=true;
				break;
		}
		switch (options.type)
		{
			case 'button_normal':
				res=$('<button type="button">').css({
					'background-color':'#f7f9fa',
					'border':'1px solid #e3e7e8',
					'border-radius':'3px',
					'box-sizing':'border-box',
					'color':'#3498db',
					'cursor':'pointer',
					'display':'inline-block',
					'height':options.height,
					'line-height':options.height,
					'margin':options.margin,
					'outline':'none',
					'padding':'0px 16px',
					'position':'relative',
					'text-align':'center',
					'vertical-align':'top',
					'width':options.width
				}).text(options.label);
				if (!options.class) options.class='tis_button_normal';
				res.addClass(options.class);
				$('body').append($('<style>').addClass('style_'+options.class).attr('type','text/css').text((function(){
					var res='';
					res+='button.'+options.class+':hover{background-color:#1d6fa5 !important;color:#ffffff !important;}';
					return res;
				})()));
				break;
			case 'button_ok':
				res=$('<button type="button">').css({
					'background-color':'#3498db',
					'border':'none',
					'border-radius':'3px',
					'box-sizing':'border-box',
					'color':'#ffffff',
					'cursor':'pointer',
					'display':'inline-block',
					'height':options.height,
					'line-height':options.height,
					'margin':options.margin,
					'outline':'none',
					'padding':'0px 16px',
					'position':'relative',
					'text-align':'center',
					'vertical-align':'top',
					'width':options.width
				}).text(options.label);
				if (!options.class) options.class='tis_button_ok';
				res.addClass(options.class);
				$('body').append($('<style>').addClass('style_'+options.class).attr('type','text/css').text((function(){
					var res='';
					res+='button.'+options.class+':hover{background-color:#1d6fa5 !important;}';
					return res;
				})()));
				break;
			case 'checkbox':
				res=$('<label>').css({
					'background-color':'transparent',
					'border':'none',
					'box-sizing':'border-box',
					'cursor':'pointer',
					'display':'inline-block',
					'height':options.height,
					'margin':options.margin,
					'padding':'0px 16px',
					'position':'relative',
					'vertical-align':'top',
					'width':options.width
				})
				.append($('<input type="checkbox">').css({'display':'none'}))
				.append(
					$('<span>').css({
						'background-position':'left center',
						'background-repeat':'no-repeat',
						'background-size':'30px 30px',
						'box-sizing':'border-box',
						'display':'inline-block',
						'font-size':'14px',
						'line-height':options.height,
						'padding':'0px 0px 0px 35px',
						'position':'relative',
						'vertical-align':'top',
						'width':((ismobile)?'100%':'auto')
					})
					.text(options.label)
				);
				if (!options.class) options.class='tis_checkbox';
				res.addClass(options.class);
				$('body').append($('<style>').addClass('style_'+options.class).attr('type','text/css').text((function(){
					var res='';
					res+='label.'+options.class+' span{background-image:url("https://tis2010.jp/library/kintone/images/checkbox_nocheck.svg");}';
					res+='label.'+options.class+' input:checked+span{background-image:url("https://tis2010.jp/library/kintone/images/checkbox_checked.svg");}';
					return res;
				})()));
				break;
			case 'select':
				res=$('<div>').css({
					'background-color':'#f7f9fa',
					'border':'1px solid #e3e7e8',
					'box-shadow':'1px 1px 1px #fff inset',
					'box-sizing':'border-box',
					'display':'inline-block',
					'height':options.height,
					'margin':options.margin,
					'overflow':'hidden',
					'padding':'0 0 0 16px',
					'position':'relative',
					'max-width':'auto',
					'min-width':'auto',
					'text-overflow':'ellipsis',
					'vertical-align':'top',
					'width':options.width
				})
				.append(
					(function(){
						var res=$('<select>').css({
							'background-color':'transparent',
							'border':'none',
							'color':'#3498db',
							'cursor':'pointer',
							'height':options.height,
							'margin':'0',
							'min-width':'auto',
							'outline':'none',
							'padding':'0 32px 0 0',
							'width':'100%',
							'-moz-appearance':'none',
							'-webkit-appearance':'none',
							'-ms-appearance':'none',
							'appearance':'none'
						});
						for (var i=0;i<options.options.length;i++)
							res.append(
								$('<option>').css({
									'background-color':'#fff',
									'color':'#3498db',
									'padding':'0 16px',
									'width':'100%',
									'-moz-appearance':'none',
									'-webkit-appearance':'none',
									'-ms-appearance':'none',
									'appearance':'none'
								})
								.attr('value',options.options[i].id)
								.html(options.options[i].name)
							);
						return res;
					})()
				);
				if (!options.class) options.class='tis_select';
				res.addClass(options.class);
				$('body').append($('<style>').addClass('style_'+options.class).attr('type','text/css').text((function(){
					var res='';
					res+='div.'+options.class+':after{';
					res+='background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAYAAADN5B7xAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUwM0JEQzc5RUZENzExRTNBRjRFQ0I1NjlCRDUzOTA5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjUwM0JEQzdBRUZENzExRTNBRjRFQ0I1NjlCRDUzOTA5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTAzQkRDNzdFRkQ3MTFFM0FGNEVDQjU2OUJENTM5MDkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTAzQkRDNzhFRkQ3MTFFM0FGNEVDQjU2OUJENTM5MDkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7KovlSAAAAhElEQVR42mI0mX7LjoGB4RADccCWCUjsB2ILIhSD1BwAadAB4qNAbIxHsTFUjQ5Iw3UgNgTiU1AaHRggyV1nggpegppyBoj1kBTrAvFZIDaBqmFgQZK8AMRmQHwe6kyYmAVUjAFdAwPUNGsgvgLl2wDxaWQFLFjcfAKIHaHs4+iSAAEGABHGF74RDCRaAAAAAElFTkSuQmCC) no-repeat center center transparent;';
					res+='bottom:0;';
					res+='content:"";';
					res+='display:block;';
					res+='pointer-events:none;';
					res+='position:absolute;';
					res+='right:0;';
					res+='top:0;';
					res+='width:32px;';
					res+='}';
					return res;
				})()));
				break;
		}
		container.append(res);
		return res;
	},
	createrecord:function(properties,callback){
		var mappings=[];
		var res={};
		var createfield=function(keys,index){
			var key=keys[index];
			var fieldinfo=properties[key];
			/* check field type */
			switch (fieldinfo.type)
			{
				case 'CALC':
				case 'CATEGORY':
				case 'CREATED_TIME':
				case 'CREATOR':
				case 'GROUP':
				case 'MODIFIER':
				case 'RECORD_NUMBER':
				case 'REFERENCE_TABLE':
				case 'STATUS':
				case 'STATUS_ASSIGNEE':
				case 'UPDATED_TIME':
					if (typeof (callback)=='function')
					{
						index++;
						if (index<keys.length) createfield(keys,index);
						else callback(res);
					}
					else
					{
						index++;
						if (index<keys.length) return createfield(keys,index);
						else return res;
					}
					break;
				default:
					switch (fieldinfo.type)
					{
						case 'SUBTABLE':
							var tablecode=fieldinfo.code;
							var tablefields={};
							res[tablecode]={value:[]};
							$.each(fieldinfo.fields,function(key,values){
								if (!values.expression)
									if ($.inArray(values.code,mappings)<0) tablefields[values.code]=values;
							});
							if (typeof (callback)=='function')
							{
								$.createrow(tablefields,function(row){
									res[tablecode].value.push(row);
									index++;
									if (index<keys.length) createfield(keys,index);
									else callback(res);
								});
							}
							else
							{
								res[tablecode].value.push($.createrow(tablefields));
								index++;
								if (index<keys.length) return createfield(keys,index);
								else return res;
							}
							break;
						default:
							if (typeof (callback)=='function')
							{
								$.fielddefault(fieldinfo,function(defaults){
									if (!fieldinfo.expression)
										if ($.inArray(fieldinfo.code,mappings)<0)
											res[fieldinfo.code]={value:defaults.value};
									index++;
									if (index<keys.length) createfield(keys,index);
									else callback(res);
								});
							}
							else
							{
								if (!fieldinfo.expression)
									if ($.inArray(fieldinfo.code,mappings)<0)
										res[fieldinfo.code]={value:$.fielddefault(fieldinfo).value};
								index++;
								if (index<keys.length) return createfield(keys,index);
								else return res;
							}
							break;
					}
			}
		};
		/* append lookup mappings fields */
		$.each($.fieldparallelize(properties),function(key,values){
			if (values.lookup)
				$.each(values.lookup.fieldMappings,function(index,values){
					mappings.push(values.field);
				});
		});
		return createfield(Object.keys(properties),0);
	},
	createrow:function(fields,callback){
		var date=new Date();
		var row={value:{}};
		var createfield=function(keys,index){
			var key=keys[index];
			var fieldinfo=fields[key];
			if (fieldinfo)
			{
				row.value[key]={type:fieldinfo.type,value:null};
				if (typeof (callback)=='function')
				{
					$.fielddefault(fieldinfo,function(defaults){
						row.value[key].value=defaults.value;
						index++;
						if (index<keys.length) createfield(keys,index);
						else callback(row);
					});
				}
				else
				{
					row.value[key].value=$.fielddefault(fieldinfo).value;
					index++;
					if (index<keys.length) return createfield(keys,index);
					else return row;
				}
			}
			else
			{
				if (typeof (callback)=='function')
				{
					index++;
					if (index<keys.length) createfield(keys,index);
					else callback(row);
				}
				else
				{
					index++;
					if (index<keys.length) return createfield(keys,index);
					else return row;
				}
			}
		};
		return createfield(Object.keys(fields),0);
	},
	download:function(fileKey){
		return new Promise(function(resolve,reject)
		{
			var url=kintone.api.url('/k/v1/file',true)+'?fileKey='+fileKey;
			var xhr=new XMLHttpRequest();
			xhr.open('GET',url);
			xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
			xhr.responseType='blob';
			xhr.onload=function(){
				if (xhr.status===200) resolve(xhr.response);
				else reject(Error('File download error:' + xhr.statusText));
			};
			xhr.onerror=function(){
				reject(Error('There was a network error.'));
			};
			xhr.send();
		});
	},
	upload:function(filename,contentType,data){
		return new Promise(function(resolve,reject)
		{
			var blob=new Blob([data],{type:contentType});
			var filedata=new FormData();
			var url=kintone.api.url('/k/v1/file',true);
			var xhr=new XMLHttpRequest();
			filedata.append('__REQUEST_TOKEN__',kintone.getRequestToken());
			filedata.append('file',blob,filename);
			xhr.open('POST',url,false);
			xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
			xhr.responseType='multipart/form-data';
			xhr.onload=function(){
				if (xhr.status===200) resolve(xhr.responseText);
				else reject(Error('File upload error:' + xhr.statusText));
			};
			xhr.onerror=function(){
				reject(Error('There was a network error.'));
			};
			xhr.send(filedata);
		});
	},
	downloadtext:function(values,character,filename){
		if (!Encoding) {alert('encoding.jsを読み込んで下さい。');return;}
		var strtoarray=function(str){
			var arr=[];
			for (var i=0;i<str.length;i++)
				arr.push(str.charCodeAt(i));
			return arr;
		};
		var array=strtoarray(values.replace(/\n$/g,''));
		var blob=new Blob([new Uint8Array(Encoding.convert(array,character,Encoding.detect(array)))],{'type':'text/plain'});
		if (window.navigator.msSaveBlob) window.navigator.msSaveOrOpenBlob(blob,filename);
		else
		{
			var a=document.createElement('a');
			var url=window.URL || window.webkitURL;
			a.setAttribute('href',url.createObjectURL(blob));
			a.setAttribute('target','_blank');
			a.setAttribute('download',filename);
			a.style.display='none';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	},
	uploadtext:function(file,character,success,error){
		if (!Encoding) {alert('encoding.jsを読み込んで下さい。');return;}
		var reader=null;
		reader=new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onabort=function(event){error();};
		reader.onerror=function(event){error();};
		reader.onload=function(event){
			var array=new Uint8Array(event.target.result);
			var records=Encoding.codeToString(Encoding.convert(array,character,Encoding.detect(array)));
			success(records);
		}
	},
	duplicaterecord:function(app,id,callback){
		var files=[];
		var setupfile=function(counter,files,callback){
			if (counter<files.length)
			{
				$.download(files[counter].fileinfo.fileKey).then(function(blob){
					$.upload(files[counter].fileinfo.name,files[counter].fileinfo.contentType,blob).then(function(resp){
						files[counter].field.value.push({fileKey:JSON.parse(resp).fileKey})
						counter++;
						setupfile(counter,files,callback);
					});
				});
			}
			else callback();
		};
		var body={
			app:app,
			id:id
		};
		kintone.api(kintone.api.url('/k/v1/record',true),'GET',body,function(resp){
			var record=resp.record;
			body={
				app:app,
				record:(function(record){
					var res={};
					$.each(record,function(key,values){
						switch (values.type)
						{
							case 'CALC':
							case 'CATEGORY':
							case 'CREATED_TIME':
							case 'CREATOR':
							case 'MODIFIER':
							case 'RECORD_NUMBER':
							case 'STATUS':
							case 'STATUS_ASSIGNEE':
							case 'UPDATED_TIME':
								break;
							case 'FILE':
								res[key]={value:[]};
								for (var i=0;i<values.value.length;i++)
									files.push({
										field:res[key],
										fileinfo:values.value[i]
									})
								break;
							case 'SUBTABLE':
								res[key]={value:[]};
								for (var i=0;i<values.value.length;i++)
								{
									var row={value:{}};
									$.each(values.value[i].value,function(key,values){
										if (values.type=='FILE')
										{
											row.value[key]={value:[]};
											for (var i2=0;i2<values.value.length;i2++)
												files.push({
													field:row.value[key],
													fileinfo:values.value[i2]
												})
										}
										else row.value[key]=values;
									});
									res[key].value.push(row);
								}
								break;
							default:
								res[key]=values;
								break;
						}
					});
					return res;
				})(record)
			};
			setupfile(0,files,function(){
				kintone.api(kintone.api.url('/k/v1/record',true),'POST',body,function(resp){
					body={
						app:app,
						id:resp.id
					};
					kintone.api(kintone.api.url('/k/v1/record',true),'GET',body,function(resp){
						if (callback) callback(resp.record);
					},function(error){
						alert($.builderror(error));
					});
				},function(error){
					alert($.builderror(error));
				});
			});
		},function(error){
			alert($.builderror(error));
		});
	},
	fielddefault:function(fieldinfo,callback){
		var date=new Date();
		var pending=false;
		var res={error:'',value:null};
		var hasdefault=fieldinfo.defaultValue;
		switch (fieldinfo.type)
		{
			case 'CHECK_BOX':
			case 'FILE':
			case 'GROUP_SELECT':
			case 'MULTI_SELECT':
			case 'ORGANIZATION_SELECT':
			case 'USER_SELECT':
				res.value=[];
				if (fieldinfo.type!='FILE') hasdefault=(hasdefault)?fieldinfo.defaultValue.length:0;
				break;
			case 'DATE':
			case 'DATETIME':
			case 'TIME':
				if (!hasdefault) hasdefault=fieldinfo.defaultValue || fieldinfo.defaultNowValue;
				break;
		}
		/* check default value */
		if (hasdefault)
		{
			switch (fieldinfo.type)
			{
				case 'CHECK_BOX':
				case 'MULTI_SELECT':
					res.value=fieldinfo.defaultValue;
					break;
				case 'DATE':
					if (fieldinfo.defaultValue)	res.value=fieldinfo.defaultValue;
					else
					{
						if (fieldinfo.defaultNowValue) res.value=date.format('Y-m-d');
						else res.value=fieldinfo.defaultValue;
					}
					break;
				case 'DATETIME':
					if (fieldinfo.defaultValue)	res.value=fieldinfo.defaultValue;
					else
					{
						if (fieldinfo.defaultNowValue)
						{
							res.value='';
							res.value+=date.format('Y-m-d');
							res.value+='T'+date.getHours().toString().lpad('0',2)+':'+date.getMinutes().toString().lpad('0',2)+':'+date.getSeconds().toString().lpad('0',2)+$.timezome();
						}
						else res.value=fieldinfo.defaultValue.replace(/\.000Z/g,$.timezome());
					}
					break;
				case 'GROUP_SELECT':
				case 'ORGANIZATION_SELECT':
					res.value=[];
					$.each(fieldinfo.defaultValue,function(index,values){
						if (values.type==fieldinfo.type.replace(/_SELECT/g,'')) res.value.push({code:values.code});
					});
					break;
				case 'TIME':
					if (fieldinfo.defaultValue)	res.value=fieldinfo.defaultValue;
					else
					{
						if (fieldinfo.defaultNowValue) res.value=date.getHours().toString().lpad('0',2)+':'+date.getMinutes().toString().lpad('0',2);
						else res.value=fieldinfo.defaultValue.split(':')[0]+':'+fieldinfo.defaultValue.split(':')[1];
					}
					break;
				case 'USER_SELECT':
					var getusers=function(target,defaultvalues,index,callback){
						var defaultvalue=defaultvalues[index];
						if (defaultvalue.code=='LOGINUSER()')
						{
							target.push({code:kintone.getLoginUser().code});
							index++;
							if (index<defaultvalues.length) getusers(target,defaultvalues,index,callback);
							else callback();
						}
						else
						{
							switch (defaultvalue.type)
							{
								case 'GROUP':
									$.loadgroupusers(function(records){
											for (var i=0;i<records.length;i++)
											{
												var usercode=records[i].code;
												var username=records[i].name;
												if ($.grep(target,function(item,index){return item.code==usercode;}).length==0)
													target.push({code:usercode,name:username});
											}
											index++;
											if (index<defaultvalues.length) getusers(target,defaultvalues,index,callback);
											else callback();
										},
										{
											code:defaultvalue.code,
											offset:0,
											records:null,
											size:100
										}
									);
									break;
								case 'ORGANIZATION':
									$.loadorganizationusers(function(records){
											for (var i=0;i<records.length;i++)
											{
												var usercode=records[i].code;
												var username=records[i].name;
												if ($.grep(target,function(item,index){return item.code==usercode;}).length==0)
													target.push({code:usercode,name:username});
											}
											index++;
											if (index<defaultvalues.length) getusers(target,defaultvalues,index,callback);
											else callback();
										},
										{
											code:defaultvalue.code,
											offset:0,
											records:null,
											size:100
										}
									);
									break;
								case 'USER':
									target.push({code:defaultvalue.code});
									index++;
									if (index<defaultvalues.length) getusers(target,defaultvalues,index,callback);
									else callback();
									break;
							}
						}
					};
					res.value=[];
					if (typeof (callback)=='function')
					{
						if (fieldinfo.defaultValue.length!=0)
						{
							pending=true;
							getusers(res.value,fieldinfo.defaultValue,0,function(){
								callback(res);
							});
						}
						else callback(res);
					}
					else
					{
						$.each(fieldinfo.defaultValue,function(index,values){
							if (values.code=='LOGINUSER()') res.value.push({code:kintone.getLoginUser().code});
							else
							{
								switch (values.type)
								{
									case 'USER':
										res.value.push({code:values.code});
										break;
								}
							}
						});
					}
					break;
				default:
					res.value=fieldinfo.defaultValue;
					break;
			}
		}
		else
		{
			/* check required */
			if (fieldinfo.required)
			{
				switch (fieldinfo.type)
				{
					case 'CHECK_BOX':
					case 'MULTI_SELECT':
						res.value=[fieldinfo.options[Object.keys(fieldinfo.options)[0]].label];
						break;
					case 'DROP_DOWN':
					case 'RADIO_BUTTON':
						res.value=(function(options){
							var value='';
							$.each(options,function(key,values){
								if (values.index==0) value=key;
							});
							return value;
						})(fieldinfo.options);
						break;
					case 'DATE':
						res.value='1000-01-01';
						break;
					case 'DATETIME':
						res.value='1000-01-01T00:00:00'+$.timezome();
						break;
					case 'FILE':
						res.error='【'+fieldinfo.label+'】入力が必須になっています。';
						break;
					case 'GROUP_SELECT':
						res.error='【'+fieldinfo.label+'】初期値を設定して下さい。';
						break;
					case 'LINK':
					case 'MULTI_LINE_TEXT':
					case 'RICH_TEXT':
					case 'SINGLE_LINE_TEXT':
						if (fieldinfo.lookup) res.error='【'+fieldinfo.label+'】入力が必須になっています。';
						else res.value='＊';
						break;
					case 'NUMBER':
						if (fieldinfo.lookup) res.error='【'+fieldinfo.label+'】入力が必須になっています。';
						else res.value=((fieldinfo.minValue)?fieldinfo.minValue:((fieldinfo.maxValue)?fieldinfo.maxValue:'0'));
						break;
					case 'ORGANIZATION_SELECT':
						res.error='【'+fieldinfo.label+'】初期値を設定して下さい。';
						break;
					case 'TIME':
						res.value='00:00';
						break;
					case 'USER_SELECT':
						res.error='【'+fieldinfo.label+'】初期値を設定して下さい。';
						break;
				}
			}
		}
		if (typeof (callback)=='function' && !pending) callback(res);
		else return res;
	},
	fieldequals:function(valuea,valueb,fields){
		var isequal=false;
		switch (fields.type)
		{
			case 'CHECK_BOX':
			case 'MULTI_SELECT':
				var compa=[];
				var compb=[];
				$.each(fields.options,function(key,values){
					if (valuea)
						if (valuea.indexOf(values.label)>-1) compa.push(values.label);
					if (valueb)
						if (valueb.indexOf(values.label)>-1) compb.push(values.label);
				});
				compa.sort(function(a,b){
					if(a<b) return -1;
					if(a>b) return 1;
					return 0;
				});
				compb.sort(function(a,b){
					if(a<b) return -1;
					if(a>b) return 1;
					return 0;
				});
				isequal=(JSON.stringify(compa)==JSON.stringify(compb));
				break;
			case 'FILE':
				var compa=[];
				var compb=[];
				if (valuea)
					for (var i=0;i<valuea.length;i++) compa.push(valuea[i].fileKey);
				if (valueb)
					for (var i=0;i<valueb.length;i++) compb.push(valueb[i].fileKey);
				compa.sort(function(a,b){
					if(a<b) return -1;
					if(a>b) return 1;
					return 0;
				});
				compb.sort(function(a,b){
					if(a<b) return -1;
					if(a>b) return 1;
					return 0;
				});
				isequal=(JSON.stringify(compa)==JSON.stringify(compb));
				break;
			case 'GROUP_SELECT':
			case 'ORGANIZATION_SELECT':
			case 'USER_SELECT':
				var compa=[];
				var compb=[];
				if (valuea)
					for (var i=0;i<valuea.length;i++) compa.push(valuea[i].code);
				if (valueb)
					for (var i=0;i<valueb.length;i++) compb.push(valueb[i].code);
				compa.sort(function(a,b){
					if(a<b) return -1;
					if(a>b) return 1;
					return 0;
				});
				compb.sort(function(a,b){
					if(a<b) return -1;
					if(a>b) return 1;
					return 0;
				});
				isequal=(JSON.stringify(compa)==JSON.stringify(compb));
				break;
			default:
				isequal=(valuea==valueb);
				break;
		}
		return isequal;
	},
	fieldparallelize:function(properties,callback){
		var fields={};
		var createproperty=function(keys,index){
			var key=keys[index];
			var fieldinfo=properties[key];
			switch (fieldinfo.type)
			{
				case 'GROUP':
					break;
				case 'SUBTABLE':
					$.each(fieldinfo.fields,function(index,values){
						values['tablecode']=fieldinfo.code;
						fields[values.code]=values;
					});
					break;
				default:
					fieldinfo['tablecode']='';
					fields[fieldinfo.code]=fieldinfo;
					break;
			}
			if (typeof (callback)=='function')
			{
				index++;
				if (index<keys.length) createproperty(keys,index);
				else createdefaults(Object.keys(fields),0);
			}
			else
			{
				index++;
				if (index<keys.length) return createproperty(keys,index);
				else return fields;
			}
		};
		var createdefaults=function(keys,index){
			var key=keys[index];
			$.fielddefault(fields[key],function(defaults){
				fields[key]['defaults']=defaults;
				index++;
				if (index<keys.length) createdefaults(keys,index);
				else callback(fields);
			});
		};
		return createproperty(Object.keys(properties),0);
	},
	fieldquery:function(field,fieldinfo){
		var res='';
		switch (field.type.toUpperCase())
		{
			case 'CHECK_BOX':
			case 'MULTI_SELECT':
				if (fieldinfo)
				{
					res=' not in (';
					$.each(fieldinfo.options,function(key,values){
						if (field.value.indexOf(values.label)<0) res+='"'+values.label+'",';
					});
					res=res.replace(/,$/g,'')+')';
				}
				else
				{
					res=' in (';
					for (var i=0;i<field.value.length;i++) res+='"'+field.value[i]+'",';
					res=res.replace(/,$/g,'')+')';
				}
				break;
			case 'CREATOR':
			case 'MODIFIER':
				res=' in ("'+field.value.code+'")';
				break;
			case 'DROP_DOWN':
			case 'RADIO_BUTTON':
				res=' in ("'+field.value+'")';
				break;
			case 'GROUP_SELECT':
			case 'ORGANIZATION_SELECT':
			case 'USER_SELECT':
				res=' in (';
				for (var i=0;i<field.value.length;i++) res+='"'+field.value[i].code+'",';
				res=res.replace(/,$/g,'')+')';
				break;
			case 'NUMBER':
			case 'RECORD_NUMBER':
				res=' = '+field.value;
				break;
			default:
				res=' = "'+field.value+'"';
				break;
		}
		return res;
	},
	fieldcompquery:function(fieldinfo,comp,value){
		var res='';
		var values=[];
		var datevalue=(function(value){
			var res=(value)?value:'';
			var convertvalue=function(value){
				var res=value;
				switch (res)
				{
					case 'NOW':
						res="NOW()";
						break;
					case 'TODAY':
						res="TODAY()";
						break;
					case 'LASTWEEK':
						res="LAST_WEEK()";
						break;
					case 'THISWEEK':
						res="THIS_WEEK()";
						break;
					case 'LASTMONTH':
						res="LAST_MONTH()";
						break;
					case 'THISMONTH':
						res="THIS_MONTH()";
						break;
					case 'THISYEAR':
						res="THIS_YEAR()";
						break;
					default:
						if (res.match(/^FROM/g))
						{
							var pattern=res.replace(/-?[0-9]+(d|m|y)$/g,'');
							var span=res.replace(pattern,'').replace(/[^0-9-]+/g,'');
							var unit=(function(unit){
								var res='';
								switch (unit)
								{
									case 'd':
										res='day';
										break;
									case 'm':
										res='month';
										break;
									case 'y':
										res='year';
										break;
								}
								return res;
							})(res.slice(-1));
							switch (pattern)
							{
								case 'FROMTODAY':
									res=new Date(new Date().format('Y-m-d')+'T00:00:00'+$.timezome()).calc(span.toString()+' '+unit).format('Y-m-d');
									break;
								case 'FROMTHISMONTH':
									res=new Date(new Date().calc('first-of-month').format('Y-m-d')+'T00:00:00'+$.timezome()).calc(span.toString()+' '+unit).format('Y-m-d');
									break;
								case 'FROMTHISYEAR':
									res=new Date(new Date().calc('first-of-year').format('Y-m-d')+'T00:00:00'+$.timezome()).calc(span.toString()+' '+unit).format('Y-m-d');
									break;
							}
						}
						res='"'+res+'"';
						break;
				}
				return res;
			};
			if (res)
			{
				switch (fieldinfo.type)
				{
					case 'CALC':
						switch (fieldinfo.format)
						{
							case 'DATE':
							case 'DATETIME':
							case 'DAY_HOUR_MINUTE':
								res=convertvalue(res);
								break;
							default:
								if (!$.isArray(res)) res='"'+res+'"';
								break;
						}
						break;
					case 'CREATED_TIME':
					case 'DATE':
					case 'DATETIME':
					case 'UPDATED_TIME':
						res=convertvalue(res);
						break;
					default:
						if (!$.isArray(res)) res='"'+res+'"';
						break;
				}
			}
			else res='"'+res+'"';
			return res;
		})(value);
		switch (fieldinfo.type)
		{
			case 'CALC':
				switch (fieldinfo.format)
				{
					case 'DATE':
					case 'DATETIME':
					case 'DAY_HOUR_MINUTE':
					case 'TIME':
					case 'HOUR_MINUTE':
						switch (comp)
						{
							case '0':
								if (fieldinfo.tablecode) res=fieldinfo.code+' in ('+datevalue+')';
								else res=fieldinfo.code+'='+datevalue;
								break;
							case '1':
								if (fieldinfo.tablecode) res=fieldinfo.code+' not in ('+datevalue+')';
								else res=fieldinfo.code+'!='+datevalue;
								break;
							case '2':
								if (value) res=fieldinfo.code+'<='+datevalue;
								break;
							case '3':
								if (value) res=fieldinfo.code+'<'+datevalue;
								break;
							case '4':
								if (value) res=fieldinfo.code+'>='+datevalue;
								break;
							case '5':
								if (value) res=fieldinfo.code+'>'+datevalue;
								break;
						}
						break;
					case 'NUMBER':
					case 'NUMBER_DIGIT':
						if (value)
							switch (comp)
							{
								case '0':
									if (fieldinfo.tablecode) res=fieldinfo.code+' in ('+value+')';
									else res=fieldinfo.code+'='+value;
									break;
								case '1':
									if (fieldinfo.tablecode) res=fieldinfo.code+' not in ('+value+')';
									else res=fieldinfo.code+'!='+value;
									break;
								case '2':
									res=fieldinfo.code+'<='+value;
									break;
								case '3':
									res=fieldinfo.code+'>='+value;
									break;
							}
						break;
				}
				break;
			case 'CHECK_BOX':
			case 'DROP_DOWN':
			case 'MULTI_SELECT':
			case 'RADIO_BUTTON':
			case 'STATUS':
				if (value)
				{
					if (!$.isArray(value)) values.push('"'+value+'"');
					else
					{
						for (var i=0;i<value.length;i++) values.push('"'+value[i]+'"');
					}
					if (values.length!=0)
						switch (comp)
						{
							case '0':
								res=fieldinfo.code+' in ('+values.join(',')+')';
								break;
							case '1':
								res=fieldinfo.code+' not in ('+values.join(',')+')';
								break;
						}
				}
				break;
			case 'CREATED_TIME':
			case 'DATE':
			case 'DATETIME':
			case 'UPDATED_TIME':
			case 'TIME':
				switch (comp)
				{
					case '0':
						if (fieldinfo.tablecode) res=fieldinfo.code+' in ('+datevalue+')';
						else res=fieldinfo.code+'='+datevalue;
						break;
					case '1':
						if (fieldinfo.tablecode) res=fieldinfo.code+' not in ('+datevalue+')';
						else res=fieldinfo.code+'!='+datevalue;
						break;
					case '2':
						if (value) res=fieldinfo.code+'<='+datevalue;
						break;
					case '3':
						if (value) res=fieldinfo.code+'<'+datevalue;
						break;
					case '4':
						if (value) res=fieldinfo.code+'>='+datevalue;
						break;
					case '5':
						if (value) res=fieldinfo.code+'>'+datevalue;
						break;
				}
				break;
			case 'CREATOR':
			case 'GROUP_SELECT':
			case 'MODIFIER':
			case 'ORGANIZATION_SELECT':
			case 'STATUS_ASSIGNEE':
			case 'USER_SELECT':
				if (value)
				{
					if ($.isPlainObject(value))
					{
						if ($.type(value)=="string")
						{
							if (value=='LOGINUSER') values.push('LOGINUSER()');
							else values.push('"'+value+'"');
						}
						else
						{
							if (value.code=='LOGINUSER') values.push('LOGINUSER()');
							else values.push('"'+value.code+'"');
						}
					}
					else
					{
						for (var i=0;i<value.length;i++)
						{
							if ($.type(value[i])=="string")
							{
								if (value[i]=='LOGINUSER') values.push('LOGINUSER()');
								else values.push('"'+value[i]+'"');
							}
							else
							{
								if (value[i].code=='LOGINUSER') values.push('LOGINUSER()');
								else values.push('"'+value[i].code+'"');
							}
						}
					}
					if (values.length!=0)
						switch (comp)
						{
							case '0':
								res=fieldinfo.code+' in ('+values.join(',')+')';
								break;
							case '1':
								res=fieldinfo.code+' not in ('+values.join(',')+')';
								break;
						}
				}
				break;
			case 'LINK':
			case 'SINGLE_LINE_TEXT':
				switch (comp)
				{
					case '0':
						if (fieldinfo.tablecode) res=fieldinfo.code+' in ("'+((value)?value:'')+'")';
						else res=fieldinfo.code+'="'+((value)?value:'')+'"';
						break;
					case '1':
						if (fieldinfo.tablecode) res=fieldinfo.code+' not in ("'+((value)?value:'')+'")';
						else res=fieldinfo.code+'!="'+((value)?value:'')+'"';
						break;
					case '2':
						if (fieldinfo.tablecode) res=fieldinfo.code+' in ("'+((value)?value:'')+'")';
						else
						{
							if (((value)?value:'').length>1) res=fieldinfo.code+' like "'+((value)?value:'')+'"';
						}
						break;
					case '3':
						if (fieldinfo.tablecode) res=fieldinfo.code+' not in ("'+((value)?value:'')+'")';
						else
						{
							if (((value)?value:'').length>1) res=fieldinfo.code+' not like "'+((value)?value:'')+'"';
						}
						break;
				}
				break;
			case 'MULTI_LINE_TEXT':
			case 'RICH_TEXT':
				switch (comp)
				{
					case '0':
						if (fieldinfo.tablecode) res=fieldinfo.code+' in ("'+((value)?value:'')+'")';
						else
						{
							if (((value)?value:'').length>1) res=fieldinfo.code+' like "'+((value)?value:'')+'"';
						}
						break;
					case '1':
						if (fieldinfo.tablecode) res=fieldinfo.code+' not in ("'+((value)?value:'')+'")';
						else
						{
							if (((value)?value:'').length>1) res=fieldinfo.code+' not like "'+((value)?value:'')+'"';
						}
						break;
				}
				break;
			case 'NUMBER':
			case 'RECORD_NUMBER':
				if (value)
					switch (comp)
					{
						case '0':
							if (fieldinfo.tablecode) res=fieldinfo.code+' in ('+value+')';
							else res=fieldinfo.code+'='+value;
							break;
						case '1':
							if (fieldinfo.tablecode) res=fieldinfo.code+' not in ('+value+')';
							else res=fieldinfo.code+'!='+value;
							break;
						case '2':
							res=fieldinfo.code+'<='+value;
							break;
						case '3':
							res=fieldinfo.code+'>='+value;
							break;
					}
				break;
		}
		return res;
	},
	fieldvalue:function(field){
		var value=null;
		if (!('type' in field)) field['type']='';
		switch (field.type.toUpperCase())
		{
			case 'CATEGORY':
			case 'CHECK_BOX':
			case 'MULTI_SELECT':
				if (field.value.length!=0) value=field.value.join('<br>');
				else value='';
				break;
			case 'CREATOR':
			case 'MODIFIER':
				value=field.value.name;
				break;
			case 'DATETIME':
				if (field.value)
				{
					if (field.value.length!=0) value=field.value.dateformat().replace(/\//g,'-');
					else value='';
				}
				else value='';
				break;
			case 'LINK':
				if (field.value.length!=0) value='<a href="'+field.value+'" target="_blank">'+field.value+'</a>';
				else value='';
				break;
			case 'MULTI_LINE_TEXT':
				if (field.value.length!=0) value=field.value.replace(/\n/g,'<br>');
				else value='';
				break;
			case 'GROUP_SELECT':
			case 'ORGANIZATION_SELECT':
			case 'STATUS_ASSIGNEE':
			case 'USER_SELECT':
				if (field.value.length!=0)
				{
					var values=[];
					$.each(field.value,function(index){
						values.push(field.value[index].name);
					});
					value=values.join('<br>');
				}
				else value='';
				break;
			default:
				if (field.value)
				{
					if (field.value.length!=0) value=field.value;
					else value='';
				}
				else value='';
				break;
		}
		return value;
	},
	formula:{
		date:function(record,row,fieldinfos,target,formula){
			try
			{
				var params=null;
				var calc=function(params,target){
					var res=null;
					var date=(function(fieldcode){
						var res=null;
						var create=function(value,type){
							var res=null;
							switch (type)
							{
								case 'DATE':
									res=new Date(value);
									break;
								case 'DATETIME':
									res=new Date(value.dateformat());
									break;
								case 'TIME':
									res=new Date(('2020-01-01T'+value+':00'+$.timezome()).dateformat());
									break;
							}
							return res;
						}
						if (fieldcode in fieldinfos)
						{
							(function(tablecode){
								if (tablecode)
								{
									if (tablecode==target.tablecode)
									{
										if (row[fieldcode].value) res=create(row[fieldcode].value,fieldinfos[fieldcode].type);
									}
									else
									{
										for (var i=0;i<record[tablecode].value.length;i++)
										{
											if (record[tablecode].value[i].value[fieldcode].value)
												res=create(record[tablecode].value[i].value[fieldcode].value,fieldinfos[fieldcode].type);
										}
									}
								}
								else
								{
									if (fieldcode in record)
										if (record[fieldcode].value) res=create(record[fieldcode].value,fieldinfos[fieldcode].type);
								}
							})(fieldinfos[fieldcode].tablecode);
						}
						return res;
					})(params[1]);
					if (date)
					{
						var patterns=params[2].split(',');
						for (var i=0;i<patterns.length;i++)
						{
							var pattern=patterns[i].replace(/^[ 　]+/g,'').replace(/[ 　]+$/g,'');
							switch (pattern)
							{
								case 'first-of-year':
								case 'first-of-month':
								case 'first-of-week':
									date=date.calc(pattern,true);
									break;
								default:
									if (pattern.match(/^([0-9-]+) (year|month|day|hour|minute)$/)) date=date.calc(pattern,true);
									else
									{
										var match=pattern.match(/^([^ ]+) (year|month|day|hour|minute)$/);
										if (match)
										{
											(function(fieldcode){
												if (fieldcode in fieldinfos)
												{
													(function(tablecode){
														if (tablecode)
														{
															if (tablecode==target.tablecode)
															{
																if ($.isNumeric(row[fieldcode].value)) date=date.calc(row[fieldcode].value+' '+match[2],true);
															}
															else
															{
																for (var i=0;i<record[tablecode].value.length;i++)
																{
																	if ($.isNumeric(record[tablecode].value[i].value[fieldcode].value))
																		date=date.calc(record[tablecode].value[i].value[fieldcode].value+' '+match[2],true);
																}
															}
														}
														else
														{
															if (fieldcode in record)
																if ($.isNumeric(record[fieldcode].value)) date=date.calc(record[fieldcode].value+' '+match[2],true);
														}
													})(fieldinfos[fieldcode].tablecode);
												}
											})(match[1]);
										}
									}
									break;
							}
						}
						switch (target.type)
						{
							case 'DATE':
								res=date.format('Y-m-d');
								break;
							case 'DATETIME':
								res=date.toISOString().replace(/[0-9]{2}\.[0-9]{3}Z$/g,'00Z');
								break;
							case 'TIME':
								res=date.format('H:i');
								break;
							default:
								switch (fieldinfos[params[1]].type)
								{
									case 'DATE':
										res=date.format('Y-m-d');
										break;
									case 'DATETIME':
										res=date.toISOString().replace(/[0-9]{2}\.[0-9]{3}Z$/g,'00Z');
										break;
									case 'TIME':
										res=date.format('H:i');
										break;
								}
								break;
						}
					}
					return res;
				}
				if (formula)
				{
					params=formula.match(/DATE_CALC\(\"([^"]+)\",[ ]*\"([^"]+)\"\)/);
					return (params)?calc(params,target):formula;
				}
				else return null;
			}
			catch(e)
			{
				return formula
			}
		},
		phonetic:function(record,row,fieldinfos,target,formula,callback){
			try
			{
				var params=null;
				var calc=function(params,target){
					var res=null;
					var text=(function(fieldcode){
						var res='';
						if (fieldcode in fieldinfos)
						{
							(function(tablecode){
								if (tablecode)
								{
									if (tablecode==target.tablecode)
									{
										if (fieldcode in row)
											if (row[fieldcode].value) res=$.fieldvalue(row[fieldcode]).replace(/\n/g,'').replace(/<br>/g,',');
									}
									else
									{
										for (var i=0;i<record[tablecode].value.length;i++)
										{
											var tablerow=record[tablecode].value[i].value;
											if (fieldcode in tablerow)
												if (tablerow[fieldcode].value)
												{
													res=$.fieldvalue(tablerow[fieldcode]).replace(/\n/g,'').replace(/<br>/g,',');
													break;
												}
										}
									}
								}
								else
								{
									if (fieldcode in record)
										if (record[fieldcode].value) res=$.fieldvalue(record[fieldcode]).replace(/\n/g,'').replace(/<br>/g,',');
								}
							})(fieldinfos[fieldcode].tablecode);
						}
						return res;
					})(params[1]);
					if (text)
					{
						kintone.proxy(
							'https://api.tricky-lab.com/phonetic',
							'POST',
							{
								'Content-Type':'application/json',
								'X-Requested-With':'XMLHttpRequest'
							},
							{
								'text':text
							},
							function(body,status,headers){
								var json=JSON.parse(body);
								switch (status)
								{
									case 200:
										switch (params[2])
										{
											case 'katakana':
												callback(json.response.katakana);
												break;
											default:
												callback(json.response.hiragana);
												break;
										}
										break;
									default:
										callback('');
										break;
								}
							},
							function(error){callback('');}
						);
					}
					else callback('');
				}
				if (formula)
				{
					params=formula.match(/PHONETIC\(\"([^"]+)\",[ ]*\"([^"]+)\"\)/);
					if (params) calc(params,target,function(resp){callback(resp);});
					else callback(formula);
				}
				else callback(null);
			}
			catch(e)
			{
				callback(formula);
			}
		},
		weekindex:function(record,row,fieldinfos,target,formula){
			try
			{
				var params=null;
				var calc=function(params,target){
					var res=null;
					var date=(function(fieldcode){
						var res=null;
						var create=function(value,type){
							var res=null;
							switch (type)
							{
								case 'DATE':
									res=new Date(value);
									break;
								case 'DATETIME':
									res=new Date(value.dateformat());
									break;
							}
							return res;
						}
						if (fieldcode in fieldinfos)
						{
							(function(tablecode){
								if (tablecode)
								{
									if (tablecode==target.tablecode)
									{
										if (row[fieldcode].value) res=create(row[fieldcode].value,fieldinfos[fieldcode].type);
									}
									else
									{
										for (var i=0;i<record[tablecode].value.length;i++)
										{
											if (record[tablecode].value[i].value[fieldcode].value)
												res=create(record[tablecode].value[i].value[fieldcode].value,fieldinfos[fieldcode].type);
										}
									}
								}
								else
								{
									if (fieldcode in record)
										if (record[fieldcode].value) res=create(record[fieldcode].value,fieldinfos[fieldcode].type);
								}
							})(fieldinfos[fieldcode].tablecode);
						}
						return res;
					})(params[1]);
					if (date) res=date.getDay();
					return res;
				}
				if (formula)
				{
					params=formula.match(/WEEK_CALC\(\"([^"]+)\"\)/);
					return (params)?calc(params,target):formula;
				}
				else return null;
			}
			catch(e)
			{
				return formula
			}
		}
	},
	markercolors:function(){
		return [
			{name:'レッド',back:'e60012',fore:'000000'},
			{name:'臙脂',back:'e5171f',fore:'000000'},
			{name:'紅梅',back:'e44d93',fore:'000000'},
			{name:'ローズ',back:'e85298',fore:'000000'},
			{name:'縹',back:'0078ba',fore:'ffffff'},
			{name:'ブルー',back:'0079c2',fore:'ffffff'},
			{name:'セルリアンブルー',back:'00a0de',fore:'000000'},
			{name:'スカイ',back:'00a7db',fore:'000000'},
			{name:'エメラルド',back:'00ada9',fore:'000000'},
			{name:'グリーン',back:'009944',fore:'000000'},
			{name:'緑',back:'019a66',fore:'000000'},
			{name:'リーフ',back:'6cbb5a',fore:'000000'},
			{name:'萌黄',back:'a9cc51',fore:'000000'},
			{name:'ゴールド',back:'d7c447',fore:'000000'},
			{name:'オレンジ',back:'f39700',fore:'000000'},
			{name:'柑子',back:'ee7b1a',fore:'000000'},
			{name:'ブラウン',back:'bb641d',fore:'000000'},
			{name:'マルーン',back:'814721',fore:'ffffff'},
			{name:'ルビー',back:'b6007a',fore:'ffffff'},
			{name:'京紫',back:'522886',fore:'ffffff'},
			{name:'パープル',back:'9b7cb6',fore:'000000'},
			{name:'シルバー',back:'9caeb7',fore:'000000'},
			{name:'ホワイト',back:'ffffff',fore:'000000'},
			{name:'ブラック',back:'000000',fore:'ffffff'}
		];
	},
	math:function(a,b,type){
		var pos=Math.max(
			(function(value){
				if (String(value).match(/^(-)?[0-9]+.[0-9]+/g))
				{
					var res=String(value).split('.');
					return res[res.length-1].length;
				}
				else return 0;
			})(a),
			(function(value){
				if (String(value).match(/^(-)?[0-9]+.[0-9]+/g))
				{
					var res=String(value).split('.');
					return res[res.length-1].length;
				}
				else return 0;
			})(b)
		);
		switch (type)
		{
			case '+':
				return (parseInt((a.toFixed(pos)+'').replace('.',''))+parseInt((b.toFixed(pos)+'').replace('.','')))/Math.pow(10,pos);
				break;
			case '-':
				return (parseInt((a.toFixed(pos)+'').replace('.',''))-parseInt((b.toFixed(pos)+'').replace('.','')))/Math.pow(10,pos);
				break;
			default:
				return 0;
		}
	},
	isemptyrow:function(row,fields,callback){
		var isempty=true;
		var value=null;
		var date=new Date();
		var checkempty=function(keys,index){
			var key=keys[index];
			value=row[key].value;
			switch (row[key].type)
			{
				case 'CALC':
					value='';
					break;
				case 'CHECK_BOX':
				case 'MULTI_SELECT':
					if (fields)
					{
						fields[key].defaultValue.sort(function(a,b){
							if(a<b) return -1;
							if(a>b) return 1;
							return 0;
						});
						value.sort(function(a,b){
							if(a<b) return -1;
							if(a>b) return 1;
							return 0;
						});
						value=(JSON.stringify(fields[key].defaultValue)==JSON.stringify(value))?[]:value;
					}
					break;
				case 'DATE':
					if (fields)
					{
						if (fields[key].defaultNowValue) value=(value==date.format('Y-m-d'))?null:value;
						else
						{
							if (fields[key].defaultValue) value=(value==fields[key].defaultValue)?null:value;
						}
					}
					value=(value)?value.toString():'';
					break;
				case 'DATETIME':
					if (fields)
					{
						if (fields[key].defaultNowValue)
						{
							value=(value==(function(){
								var res='';
								res+=date.format('Y-m-d');
								res+='T'+date.getHours().toString().lpad('0',2)+':'+date.getMinutes().toString().lpad('0',2)+':'+date.getSeconds().toString().lpad('0',2)+$.timezome();
								return res;
							})())?null:value;
						}
						else
						{
							if (value)
								if (fields[key].defaultValue) value=(value.dateformat()==fields[key].defaultValue.replace(/\.000Z/g,$.timezome()).dateformat())?null:value;
						}
					}
					value=(value)?value.toString():'';
					break;
				case 'FILE':
					value='';
					break;
				case 'GROUP_SELECT':
				case 'ORGANIZATION_SELECT':
					if (fields)
					{
						var defaults=[];
						var values=[];
						if (fields[key].defaultValue)
							for (var i=0;i<fields[key].defaultValue.length;i++)
								if (fields[key].defaultValue[i].type==row[key].type.replace(/_SELECT/g,''))	defaults.push(fields[key].defaultValue[i].code);
						for (var i=0;i<value.length;i++) values.push(value[i].code);
						defaults.sort(function(a,b){
							if(a<b) return -1;
							if(a>b) return 1;
							return 0;
						});
						values.sort(function(a,b){
							if(a<b) return -1;
							if(a>b) return 1;
							return 0;
						});
						value=(JSON.stringify(defaults)==JSON.stringify(values))?[]:values;
					}
					break;
				case 'TIME':
					if (fields)
					{
						if (fields[key].defaultNowValue) value=(value==(date.getHours().toString().lpad('0',2)+':'+date.getMinutes().toString().lpad('0',2)))?null:value;
						else
						{
							if (fields[key].defaultValue) value=(value==fields[key].defaultValue.split(':')[0]+':'+fields[key].defaultValue.split(':')[1])?null:value;
						}
					}
					value=(value)?value.toString():'';
					break;
				case 'USER_SELECT':
					var defaults=[];
					var values=[];
					var getusers=function(target,defaultvalues,index,pending,callback){
						var defaultvalue=defaultvalues[index];
						if (defaultvalue.code=='LOGINUSER()')
						{
							target.push(kintone.getLoginUser().code);
							index++;
							if (index<defaultvalues.length) getusers(target,defaultvalues,index,pending,callback);
							else callback();
						}
						else
						{
							switch (defaultvalue.type)
							{
								case 'GROUP':
									if (pending)
									{
										$.loadgroupusers(function(records){
												for (var i=0;i<records.length;i++)
												{
													var usercode=records[i].code;
													var username=records[i].name;
													if ($.grep(target,function(item,index){return item.code==usercode;}).length==0)
														target.push(usercode);
												}
												index++;
												if (index<defaultvalues.length) getusers(target,defaultvalues,index,pending,callback);
												else callback();
											},
											{
												code:defaultvalue.code,
												offset:0,
												records:null,
												size:100
											}
										);
									}
									else
									{
										index++;
										if (index<defaultvalues.length) getusers(target,defaultvalues,index,pending,callback);
										else callback();
									}
									break;
								case 'ORGANIZATION':
									if (pending)
									{
										$.loadorganizationusers(function(records){
												for (var i=0;i<records.length;i++)
												{
													var usercode=records[i].code;
													var username=records[i].name;
													if ($.grep(target,function(item,index){return item.code==usercode;}).length==0)
														target.push(usercode);
												}
												index++;
												if (index<defaultvalues.length) getusers(target,defaultvalues,index,pending,callback);
												else callback();
											},
											{
												code:defaultvalue.code,
												offset:0,
												records:null,
												size:100
											}
										);
									}
									else
									{
										index++;
										if (index<defaultvalues.length) getusers(target,defaultvalues,index,pending,callback);
										else callback();
									}
									break;
								case 'USER':
									target.push(defaultvalue.code);
									index++;
									if (index<defaultvalues.length) getusers(target,defaultvalues,index,pending,callback);
									else callback();
									break;
							}
						}
					};
					for (var i=0;i<value.length;i++) values.push(value[i].code);
					values.sort(function(a,b){
						if(a<b) return -1;
						if(a>b) return 1;
						return 0;
					});
					if (fields)
					{
						if (fields[key].defaultValue.length!=0)
						{
							getusers(defaults,fields[key].defaultValue,0,callback,function(){
								defaults.sort(function(a,b){
									if(a<b) return -1;
									if(a>b) return 1;
									return 0;
								});
								value=(JSON.stringify(defaults)==JSON.stringify(values))?[]:values;
								if (value.length!=0) return (typeof (callback)=='function')?callback(false):false;
								index++;
								if (index<keys.length) checkempty(keys,index);
								else return (typeof (callback)=='function')?callback(true):true;
							});
						}
						else
						{
							if (value.length!=0) return (typeof (callback)=='function')?callback(false):false;
							index++;
							if (index<keys.length) checkempty(keys,index);
							else return (typeof (callback)=='function')?callback(true):true;
						}
					}
					else
					{
						if (value.length!=0) return (typeof (callback)=='function')?callback(false):false;
						index++;
						if (index<keys.length) checkempty(keys,index);
						else return (typeof (callback)=='function')?callback(true):true;
					}
					break;
				default:
					if (fields)
						if (fields[key].defaultValue) value=(value==fields[key].defaultValue)?null:value;
					value=(value)?value.toString():'';
					break;
			}
			if (typeof (callback)=='function')
			{
				if (row[key].type!='USER_SELECT')
				{
					if (value.length!=0) return callback(false);
					index++;
					if (index<keys.length) checkempty(keys,index);
					else callback(true);
				}
			}
			else
			{
				if (value.length!=0) return false;
				index++;
				if (index<keys.length) return checkempty(keys,index);
				else return true;
			}
		};
		return checkempty(Object.keys(row),0);
	},
	isguestspace:function(spaceid,callback){
		if (spaceid)
		{
			kintone.api(kintone.api.url('/k/guest/'+spaceid+'/v1/space', true),'GET',{id:spaceid},function(resp){
				callback(true);
			},function(error){
				callback(false);
			});
		}
		else callback(false);
	},
	isvalidtype:function(criteria,target){
		var types=[];
		switch (criteria.type)
		{
			case 'CALC':
				switch (criteria.format)
				{
					case 'DATE':
						types=['DATE'];
						break;
					case 'DATETIME':
						types=['DATETIME'];
						break;
					case 'DAY_HOUR_MINUTE':
					case 'HOUR_MINUTE':
						types=['SINGLE_LINE_TEXT'];
						break;
					case 'NUMBER':
					case 'NUMBER_DIGIT':
						types=['NUMBER','RECORD_NUMBER'];
						break;
					case 'TIME':
						types=['TIME'];
						break;
				}
				break;
			case 'CHECK_BOX':
			case 'MULTI_SELECT':
				types=['CHECK_BOX','MULTI_SELECT'];
				break;
			case 'DATETIME':
				types=['DATETIME'];
				break;
			case 'DATE':
				types=['DATE'];
				break;
			case 'DROP_DOWN':
			case 'RADIO_BUTTON':
				types=['DROP_DOWN','RADIO_BUTTON','SINGLE_LINE_TEXT'];
				break;
			case 'FILE':
				types=['FILE'];
				break;
			case 'GROUP_SELECT':
				types=['GROUP_SELECT'];
				break;
			case 'LINK':
				types=['LINK','SINGLE_LINE_TEXT'];
				break;
			case 'MULTI_LINE_TEXT':
				types=['MULTI_LINE_TEXT'];
				break;
			case 'NUMBER':
				types=['NUMBER','RECORD_NUMBER'];
				break;
			case 'ORGANIZATION_SELECT':
				types=['ORGANIZATION_SELECT'];
				break;
			case 'RECORD_NUMBER':
				types=['NUMBER','RECORD_NUMBER','SINGLE_LINE_TEXT'];
				break;
			case 'RICH_TEXT':
				types=['RICH_TEXT'];
				break;
			case 'SINGLE_LINE_TEXT':
				types=['SINGLE_LINE_TEXT'];
				break;
			case 'TIME':
				types=['TIME'];
				break;
			case 'USER_SELECT':
				types=['USER_SELECT'];
				break;
		}
		return ($.inArray(target.type,types)>-1);
	},
	isvalidcomptype:function(criteria,target){
		var match=false;
		switch (criteria.type)
		{
			case 'CALC':
				if (target.type=='CALC') match=(target.format==criteria.format);
				else
				{
					var types=[];
					switch (criteria.format)
					{
						case 'DATE':
							types=['DATE'];
							break;
						case 'DATETIME':
							types=['DATETIME'];
							break;
						case 'DAY_HOUR_MINUTE':
						case 'HOUR_MINUTE':
							types=['SINGLE_LINE_TEXT'];
							break;
						case 'NUMBER':
						case 'NUMBER_DIGIT':
							types=['NUMBER','RECORD_NUMBER'];
							break;
						case 'TIME':
							types=['TIME'];
							break;
					}
					match=($.inArray(target.type,types)>-1);
				}
				break;
			case 'CHECK_BOX':
			case 'MULTI_SELECT':
				match=($.inArray(target.type,['CHECK_BOX','MULTI_SELECT'])>-1);
				break;
			case 'CREATED_TIME':
			case 'DATETIME':
			case 'UPDATED_TIME':
				if (target.type=='CALC') match=(target.format=='DATETIME');
				else match=($.inArray(target.type,['CREATED_TIME','DATETIME','UPDATED_TIME'])>-1)
				break;
			case 'DATE':
				if (target.type=='CALC') match=(target.format=='DATE');
				else match=($.inArray(target.type,['DATE'])>-1)
				break;
			case 'DROP_DOWN':
			case 'RADIO_BUTTON':
			case 'LINK':
			case 'SINGLE_LINE_TEXT':
			case 'STATUS':
				match=($.inArray(target.type,['DROP_DOWN','RADIO_BUTTON','LINK','SINGLE_LINE_TEXT'])>-1);
				break;
			case 'GROUP_SELECT':
				match=($.inArray(target.type,['GROUP_SELECT'])>-1);
				break;
			case 'MULTI_LINE_TEXT':
				match=($.inArray(target.type,['LINK','MULTI_LINE_TEXT','SINGLE_LINE_TEXT'])>-1);
				break;
			case 'NUMBER':
				if (target.type=='CALC') match=(target.format=='NUMBER');
				else match=($.inArray(target.type,['NUMBER','RECORD_NUMBER'])>-1);
				break;
			case 'ORGANIZATION_SELECT':
				match=($.inArray(target.type,['ORGANIZATION_SELECT'])>-1);
				break;
			case 'RECORD_NUMBER':
				match=($.inArray(target.type,['NUMBER','RECORD_NUMBER'])>-1);
				break;
			case 'RICH_TEXT':
				match=($.inArray(target.type,['LINK','RICH_TEXT','SINGLE_LINE_TEXT'])>-1);
				break;
			case 'TIME':
				if (target.type=='CALC') match=(target.format=='TIME');
				else match=($.inArray(target.type,['TIME'])>-1)
				break;
			case 'CREATOR':
			case 'MODIFIER':
			case 'STATUS_ASSIGNEE':
			case 'USER_SELECT':
				match=($.inArray(target.type,['CREATOR','MODIFIER','STATUS_ASSIGNEE','USER_SELECT'])>-1);
				break;
		}
		return match;
	},
	loadgroups:function(callback,param){
		var param=$.extend(true,{
			offset:0,
			records:null,
			size:100
		},param);
		var query='?size='+param.size.toString()+'&offset='+param.offset.toString();
		kintone.api(kintone.api.url('/v1/groups',true)+query,'GET',{},function(resp){
			if (param.records==null) param.records=resp.groups;
			else Array.prototype.push.apply(param.records,resp.groups);
			param.offset+=param.size;
			if (resp.groups.length==param.size) $.loadgroups(callback,param);
			else callback(param.records);
		},function(error){callback([]);});
	},
	loadgroupusers:function(callback,param){
		var param=$.extend(true,{
			code:'',
			offset:0,
			records:null,
			size:100
		},param);
		var query='?code='+param.code+'&size='+param.size.toString()+'&offset='+param.offset.toString();
		kintone.api(kintone.api.url('/v1/group/users',true)+query,'GET',{},function(resp){
			if (param.records==null) param.records=$.grep(resp.users,function(item,index){return item.valid;});
			else Array.prototype.push.apply(param.records,$.grep(resp.users,function(item,index){return item.valid;}));
			param.offset+=param.size;
			if (resp.users.length==param.size) $.loadgroupusers(callback,param);
			else callback(param.records);
		},function(error){callback([]);});
	},
	loadorganizations:function(callback,param){
		var param=$.extend(true,{
			offset:0,
			records:null,
			size:100
		},param);
		var query='?size='+param.size.toString()+'&offset='+param.offset.toString();
		kintone.api(kintone.api.url('/v1/organizations',true)+query,'GET',{},function(resp){
			if (param.records==null) param.records=resp.organizations;
			else Array.prototype.push.apply(param.records,resp.organizations);
			param.offset+=param.size;
			if (resp.organizations.length==param.size) $.loadorganizations(callback,param);
			else callback(param.records);
		},function(error){callback([]);});
	},
	loadorganizationusers:function(callback,param){
		var param=$.extend(true,{
			code:'',
			offset:0,
			records:null,
			size:100
		},param);
		var query='?code='+param.code+'&size='+param.size.toString()+'&offset='+param.offset.toString();
		kintone.api(kintone.api.url('/v1/organization/users',true)+query,'GET',{},function(resp){
			var records=[];
			for (var i=0;i<resp.userTitles.length;i++) if (resp.userTitles[i].user.valid) records.push(resp.userTitles[i].user);
			if (param.records==null) param.records=records;
			else Array.prototype.push.apply(param.records,records);
			param.offset+=param.size;
			if (records.length==param.size) $.loadorganizationusers(callback,param);
			else callback(param.records);
		},function(error){callback([]);});
	},
	loadusers:function(callback,param){
		var param=$.extend(true,{
			offset:0,
			records:null,
			size:100
		},param);
		var query='?size='+param.size.toString()+'&offset='+param.offset.toString();
		kintone.api(kintone.api.url('/v1/users',true)+query,'GET',{},function(resp){
			if (param.records==null) param.records=$.grep(resp.users,function(item,index){return item.valid;});
			else Array.prototype.push.apply(param.records,$.grep(resp.users,function(item,index){return item.valid;}));
			param.offset+=param.size;
			if (resp.users.length==param.size) $.loadusers(callback,param);
			else callback(param.records);
		},function(error){callback([]);});
	},
	lookupdoublecheck:function(index,fieldinfos,callback){
		var fieldinfo=fieldinfos[index];
		if (fieldinfo.lookup)
		{
			/* get fields of app */
			kintone.api(kintone.api.url('/k/v1/app/form/fields',true),'GET',{app:fieldinfo.lookup.relatedApp.app},function(resp){
				if (!resp.properties[fieldinfo.lookup.relatedKeyField].unique)
				{
					var property=resp.properties[fieldinfo.lookup.relatedKeyField];
					kintone.api(kintone.api.url('/k/v1/app',true),'GET',{id:fieldinfo.lookup.relatedApp.app},function(resp){
						callback('次のフィールドは重複禁止である必要があります。\nアプリ名：'+resp.name+'\nフィールド名：'+property.label);
					},function(error){});
				}
				else
				{
					index++;
					if (index<fieldinfos.length) $.lookupdoublecheck(index,fieldinfos,callback);
					else callback();
				}
			},function(error){
				alert($.builderror(error));
			});
		}
		else
		{
			index++;
			if (index<fieldinfos.length) $.lookupdoublecheck(index,fieldinfos,callback);
			else callback();
		}
	},
	queries:function(){
		var queries={};
		var hash=null;
		var hashes=window.location.search.substring(1).split('&');
		for(var i=0;i<hashes.length;i++)
		{
			hash=hashes[i].split('=');
			queries[decodeURI(hash[0])]=decodeURI(hash[1]);
		}
		return queries;
	},
	timezome:function(){
		return '+'+Math.floor(new Date().getTimezoneOffset()/-60).toString().lpad('0',2)+((new Date().getTimezoneOffset()%-60)*60).toString().lpad('0',2);
	}
});
/*
jTis prototype extention
*/
jTis.fn.adjustabletable=function(options){
	var AdjustTable=function(options){
		var options=$.extend(true,{
			table:null,
			add:'',
			del:'',
			addcallback:null,
			delcallback:null
		},options);
		/* property */
		this.lastrow=null;
		this.container=options.table;
		this.contents=this.container.children('tbody');
		this.add=options.add;
		this.del=options.del;
		this.addcallback=options.addcallback;
		this.delcallback=options.delcallback;
		/* initialize valiable */
		this.rows=this.contents.children('tr');
		this.template=this.rows.first().clone(true);
		/* create rows */
		if (this.rows!=null) this.rows.remove();
		this.addrow();
	};
	AdjustTable.prototype={
		addrow:function(row){
			var my=this;
			var target=this.template.clone(true);
			if (row==null)
			{
				if (this.lastrow) target.insertAfter(this.lastrow);
				else this.contents.append(target);
				this.lastrow=target;
			}
			else
			{
				if (this.contents.find('tr').index(row)==this.contents.find('tr').length-1)
				{
					target.insertAfter(this.lastrow);
					this.lastrow=target;
				}
				else target.insertAfter(row);
			}
			/* initialize valiable */
			this.rows=this.contents.children('tr');
			/* events */
			if (this.add.length!=0) $(this.add,target).on('click',function(){my.addrow($(this).closest('tr'))});
			if (this.del.length!=0)
			{
				$(this.del,target).on('click',function(){my.delrow($(this).closest('tr'))});
				$(this.del,this.rows.first()).css({'display':'none'});
			}
			if (this.addcallback!=null) this.addcallback(target,this.rows.index(target));
			return target;
		},
		delrow:function(row){
			var index=this.rows.index(row);
			row.remove();
			/* initialize valiable */
			this.rows=this.contents.children('tr');
			this.lastrow=(this.rows.length!=0)?this.rows.last():null;
			if (this.delcallback!=null) this.delcallback(index);
		},
		clearrows:function(){
			this.rows.remove();
			/* initialize valiable */
			this.rows=this.contents.children('tr');
			this.lastrow=null;
		}
	};
	return new AdjustTable($.extend(true,{
		table:$(this),
		add:'',
		del:'',
		addcallback:null,
		delcallback:null
	},options));
};
jTis.fn.attachmentbrowser=function(options){
	var AttachmentBrowser=function(options){
		var options=$.extend(true,{
			container:null,
			download:true
		},options);
		var my=this;
		/* property */
		this.downloadable=options.download;
		this.dialog=createdialog('dark');
		this.ismobile=(function(){
			var ua=navigator.userAgent;
			if (ua.indexOf('iPhone')>0 || ua.indexOf('iPod')>0 || ua.indexOf('Android')>0 && ua.indexOf('Mobile')>0 || ua.indexOf('Windows Phone')>0) return true;
			if (ua.indexOf('iPad')>0 || ua.indexOf('Android')>0) return true;
			return false;
		})();
		this.dialog.contents
		.append(
			$('<audio controls'+((!my.downloadable)?' controlsList="nodownload"':'')+'>').addClass('block').addClass('audioblock').css({
				'outline':'none'
			})
		)
		.append(
			$('<iframe>').addClass('block').addClass('htmlblock').css({
				'border':'none',
				'height':'100%',
				'outline':'none',
				'width':'100%'
			})
		)
		.append(
			$('<iframe>').addClass('block').addClass('pdfblock').css({
				'border':'none',
				'height':'100%',
				'outline':'none',
				'width':'100%'
			})
		)
		.append(
			div.clone(true).addClass('block').addClass('pdfthumbnailblock').css({
				'background-color':'rgba(102,102,102,1)',
				'height':'100%',
				'overflow':'auto',
				'padding':'0.25em 0.5em',
				'text-align':'center',
				'width':'100%'
			})
		)
		.append(
			$('<img>').addClass('block').addClass('imageblock').css({
				'bottom':'0',
				'height':'auto',
				'left':'0',
				'max-height':'100%',
				'max-width':'100%',
				'margin':'auto',
				'position':'absolute',
				'right':'0',
				'top':'0',
				'width':'auto'
			})
		)
		.append(
			div.clone(true).addClass('block').addClass('tableblock').css({
				'background-color':'rgba(255,255,255,0.85)',
				'height':'100%',
				'overflow':'auto',
				'padding':'0.5em',
				'text-align':'left',
				'width':'100%'
			})
		)
		.append(
			div.clone(true).addClass('block').addClass('textblock').css({
				'background-color':'rgba(255,255,255,0.85)',
				'height':'100%',
				'overflow-x':'hidden',
				'overflow-y':'auto',
				'padding':'0.5em',
				'text-align':'left',
				'width':'100%'
			})
		)
		.append(
			$('<video controls'+((!my.downloadable)?' controlsList="nodownload"':'')+'>').addClass('block').addClass('videoblock').css({
				'bottom':'0',
				'height':'auto',
				'left':'0',
				'max-height':'100%',
				'max-width':'100%',
				'margin':'auto',
				'outline':'none',
				'position':'absolute',
				'right':'0',
				'top':'0',
				'width':'auto'
			})
		);
		options.container.append(
			this.dialog.cover.append(
				this.dialog.container
				.append(
					(function(container,downloadable){
						if (downloadable)
							container.append(
								my.dialog.button.clone(true).css({'margin-right':'1em'}).addClass('download')
								.attr('src','https://tis2010.jp/library/kintone/images/browse_download.svg')
							);
						container.append(
							my.dialog.button.clone(true)
							.attr('src','https://tis2010.jp/library/kintone/images/browse_close.svg')
							.on('click',function(){
								my.hide();
							})
						);
						return container;
					})(this.dialog.header,this.downloadable)
				)
				.append(this.dialog.contents)
			)
		);
		if (this.ismobile)
		{
			this.dialog.contents.css({
				'overflow':'auto',
				'-webkit-overflow-scrolling':'touch'
			})
		}
		if (!this.downloadable)
		{
			this.dialog.contents.children().each(function(index){
				$(this).on('contextmenu',function(){
					return false;
				})
			});
		}
		if (typeof Encoding==='undefined')
		{
			$('head').append(
				$('<script>')
				.attr('type','text/javascript')
				.attr('src','https://tis2010.jp/library/encoding/encoding.js')
			);
		}
	};
	AttachmentBrowser.prototype={
		/* show form */
		show:function(attachment){
			var my=this;
			var download=function(blob){
				if (window.navigator.msSaveBlob) window.navigator.msSaveOrOpenBlob(blob,attachment.name);
				else
				{
					var url=window.URL || window.webkitURL;
					var a=document.createElement('a');
					a.setAttribute('href',url.createObjectURL(blob));
					a.setAttribute('target','_blank');
					a.setAttribute('download',attachment.name);
					a.style.display='none';
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				}
				my.hide();
			};
			$.download(attachment.fileKey).then(function(blob){
				var url=window.URL || window.webkitURL;
				var reader=new FileReader();
				$('.block',my.dialog.contents).hide();
				switch(attachment.contentType)
				{
					case 'application/json':
						reader.onload=function(event){
							var array=new Uint8Array(event.target.result);
							var result=Encoding.codeToString(Encoding.convert(array,'UNICODE',Encoding.detect(array)));
							$('.textblock',my.dialog.contents).html(result.replace(/\n/g,'<br>')).show();
							my.dialog.cover.show();
						};
						reader.readAsArrayBuffer(blob);
						my.dialog.cover.show();
						break;
					case 'application/pdf':
						if (!my.downloadable || my.ismobile)
						{
							var reader=new FileReader();
							reader.onload=function(e){
								kintone.proxy(
									'https://api.tricky-lab.com/pdf2images',
									'POST',
									{
										'Content-Type':'application/json',
										'X-Requested-With':'XMLHttpRequest'
									},
									{'src':e.target.result},
									function(body,status,headers){
										var json=JSON.parse(body);
										switch (status)
										{
											case 200:
												$('.pdfthumbnailblock',my.dialog.contents).empty();
												for (var i=0;i<json.images.length;i++)
												{
													var datas=atob(json.images[i]);
													var buffer=new Uint8Array(datas.length);
													for (var i2=0;i2<datas.length;i2++) buffer[i2]=datas.charCodeAt(i2);
													$('.pdfthumbnailblock',my.dialog.contents).append(
														div.clone(true).css({
															'padding':'0.25em 0',
															'text-align':'center',
															'width':'100%'
														})
														.append(
															$('<img>').css({
																'max-width':'100%',
																'margin':'auto'
															})
															.attr('src',url.createObjectURL(new Blob([buffer.buffer],{type: 'image/png'})))
														)
													);
												}
												$('.pdfthumbnailblock',my.dialog.contents).show();
												break;
											default:
												alert(json.error.message);
												break;
										}
									},
									function(error){
										if ('message' in error) alert(error.message);
										else alert('APIへの接続に失敗しました。');
									}
								);
							}
							reader.readAsDataURL(blob);
						}
						else $('.pdfblock',my.dialog.contents).attr('src',url.createObjectURL(blob)).show();
						my.dialog.cover.show();
						break;
					case 'audio/mpeg':
						$('.audioblock',my.dialog.contents).attr('src',url.createObjectURL(blob)).show();
						my.dialog.cover.show();
						break;
					case 'image/bmp':
					case 'image/gif':
					case 'image/jpeg':
					case 'image/png':
						$('.imageblock',my.dialog.contents).attr('src',url.createObjectURL(blob)).show();
						my.dialog.cover.show();
						break;
					case 'text/css':
					case 'text/javascript':
					case 'text/plain':
						reader.onload=function(event){
							var array=new Uint8Array(event.target.result);
							var result=Encoding.codeToString(Encoding.convert(array,'UNICODE',Encoding.detect(array)));
							$('.textblock',my.dialog.contents).html(result.replace(/\n/g,'<br>')).show();
							my.dialog.cover.show();
						};
						reader.readAsArrayBuffer(blob);
						my.dialog.cover.show();
						break;
					case 'text/csv':
						reader.onload=function(event){
							var array=new Uint8Array(event.target.result);
							var result=Encoding.codeToString(Encoding.convert(array,'UNICODE',Encoding.detect(array)));
							var rows=result.replace(/\r/g,'').replace(/^"/g,'').replace(/"$/g,'').replace(/",/g,',').replace(/,"/g,',').replace(/"\n/g,'\n').replace(/\n"/g,'\n').split('\n');
							if (rows.length!=0)
							{
								$('.tableblock',my.dialog.contents).empty().append((function(){
									var res=$('<table>')
									.append(
										$('<tbody>')
										.append((function(cells){
											var res=$('<tr>');
											for (var i=0;i<cells.length;i++) res.append($('<td>').css({'padding':'0px 0.25em'}));
											return res;
										})(rows[0].split(',')))
									).adjustabletable({});
									for (var i=0;i<rows.length;i++)
									{
										var row=(i>0)?res.addrow():res.lastrow;
										var cells=rows[i].split(',');
										for (var i2=0;i2<cells.length;i2++) $('td',row).eq(i2).html(cells[i2]);
									}
									return res.container;
								})()).show();
								my.dialog.cover.show();
							}
						};
						reader.readAsArrayBuffer(blob);
						my.dialog.cover.show();
						break;
					case 'text/html':
						$('.htmlblock',my.dialog.contents).attr('src',url.createObjectURL(blob)).show();
						my.dialog.cover.show();
						break;
					case 'video/mp4':
					case 'video/mpeg':
						$('.videoblock',my.dialog.contents).attr('src',url.createObjectURL(blob)).show();
						my.dialog.cover.show();
						break;
					default:
						download(blob);
						break;
				}
				if (my.downloadable) $('.download',my.dialog.header).off('click').on('click',function(){download(blob);});
			});
		},
		/* hide form */
		hide:function(){
			this.dialog.cover.hide();
		}
	};
	return new AttachmentBrowser($.extend(true,{container:$(this)},options));
};
jTis.fn.calendar=function(options){
	var Calendar=function(options){
		var options=$.extend(true,{
			container:null,
			multi:false,
			selected:null,
			closed:null,
			span:1,
			active:{back:'#FFB46E',fore:'#2B2B2B'},
			normal:{back:'#FFFFFF',fore:'#2B2B2B'},
			saturday:{back:'#FFFFFF',fore:'#69B4C8'},
			sunday:{back:'#FFFFFF',fore:'#FA8273'},
			today:{back:'#69B4C8',fore:'#2B2B2B'}
		},options);
		/* property */
		this.activedates=[];
		this.calendars=[];
		this.frommonth=new Date().calc('first-of-month');
		this.params=options;
		this.params['activestyle']={
			'background-color':this.params.active.back,
			'color':this.params.active.fore,
			'cursor':'pointer'
		};
		this.params['normalstyle']={
			'background-color':this.params.normal.back,
			'color':this.params.normal.fore,
			'cursor':'default'
		};
		this.params['saturdaystyle']={
			'background-color':this.params.saturday.back,
			'color':this.params.saturday.fore,
			'cursor':'default'
		};
		this.params['sundaystyle']={
			'background-color':this.params.sunday.back,
			'color':this.params.sunday.fore,
			'cursor':'default'
		};
		this.params['todaystyle']={
			'background-color':this.params.today.back,
			'color':this.params.today.fore,
			'cursor':'default'
		};
		/* valiable */
		var my=this;
		var calendarparams={
			height:0,
			width:0,
			rows:8,
			cells:{
				height:30,
				width:30
			},
			margin:{
				left:5,
				right:5,
				top:0,
				bottom:10
			}
		};
		var columns=(options.span<4)?options.span:4;
		var week=['日','月','火','水','木','金','土'];
		calendarparams.height=calendarparams.cells.height*calendarparams.rows+(calendarparams.rows)+(calendarparams.margin.top+calendarparams.margin.bottom);
		calendarparams.width=calendarparams.cells.width*week.length+(calendarparams.margin.left+calendarparams.margin.right);
		/* create elements */
		var div=$('<div>').css({
			'box-sizing':'border-box',
			'margin':'0px',
			'padding':'0px',
			'position':'relative',
			'vertical-align':'top'
		});
		var button=$('<button>').css({
			'background-color':'transparent',
			'background-position':'left top',
			'background-repeat':'no-repeat',
			'background-size':calendarparams.cells.width.toString()+'px '+calendarparams.cells.height.toString()+'px',
			'border':'none',
			'box-sizing':'border-box',
			'cursor':'pointer',
			'font-size':'13px',
			'height':calendarparams.cells.height.toString()+'px',
			'line-height':calendarparams.cells.height.toString()+'px',
			'margin':'0px',
			'outline':'none',
			'padding':'0px',
			'width':calendarparams.cells.width.toString()+'px'
		});
		var table=$('<table>');
		/* append elements */
		this.cover=div.clone(true).css({
			'background-color':'rgba(0,0,0,0.5)',
			'display':'none',
			'height':'100%',
			'left':'0px',
			'position':'fixed',
			'top':'0px',
			'width':'100%',
			'z-index':'999999'
		});
		this.container=div.clone(true).css({
			'background-color':'#FFFFFF',
			'bottom':'0',
			'border-radius':'5px',
			'box-shadow':'0px 0px 3px rgba(0,0,0,0.35)',
			'height':(calendarparams.height*Math.ceil(options.span/columns)+(calendarparams.cells.height*((options.multi)?3.5:2))).toString()+'px',
			'left':'0',
			'margin':'auto',
			'max-height':'100%',
			'max-width':'100%',
			'padding':(calendarparams.cells.height*2).toString()+'px 0px '+((options.multi)?calendarparams.cells.height*1.5:0).toString()+'px 0px',
			'position':'absolute',
			'right':'0',
			'text-align':'center',
			'top':'0',
			'width':(calendarparams.width*columns+10).toString()+'px'
		})
		.append(
			button.clone(true).css({
				'background-image':'url("https://tis2010.jp/library/kintone/images/close.png")',
				'position':'absolute',
				'right':'0px',
				'top':'0px',
				'z-index':options.span+1
			})
			.on('click',function(){
				if (options.closed!=null) options.closed();
				my.cover.hide();
			})
		)
		.append(
			(function(row){
				if (!options.multi && options.selected)
				{
					row.append(
						div.clone(true).css({
							'height':calendarparams.cells.height.toString()+'px',
							'line-height':calendarparams.cells.height.toString()+'px',
							'padding':'0px '+calendarparams.cells.width.toString()+'px',
							'text-align':'center',
							'width':'100%'
						})
						.append(
							$('<button>').css({
								'background-color':'transparent',
								'border':'none',
								'box-sizing':'border-box',
								'cursor':'pointer',
								'font-size':'13px',
								'height':calendarparams.cells.height.toString()+'px',
								'line-height':calendarparams.cells.height.toString()+'px',
								'margin':'0px',
								'outline':'none',
								'padding':'0.25em',
								'width':'2.5em'
							})
							.text('昨日')
							.on('click',function(){
								options.selected(null,new Date().calc('-1 day').format('Y-m-d'));
								my.cover.hide();
							})
						)
						.append(
							$('<button>').css({
								'background-color':'transparent',
								'border':'none',
								'box-sizing':'border-box',
								'cursor':'pointer',
								'font-size':'13px',
								'height':calendarparams.cells.height.toString()+'px',
								'line-height':calendarparams.cells.height.toString()+'px',
								'margin':'0px',
								'outline':'none',
								'padding':'0.25em',
								'width':'2.5em'
							})
							.text('今日')
							.on('click',function(){
								options.selected(null,new Date().format('Y-m-d'));
								my.cover.hide();
							})
						)
						.append(
							$('<button>').css({
								'background-color':'transparent',
								'border':'none',
								'box-sizing':'border-box',
								'cursor':'pointer',
								'font-size':'13px',
								'height':calendarparams.cells.height.toString()+'px',
								'line-height':calendarparams.cells.height.toString()+'px',
								'margin':'0px',
								'outline':'none',
								'padding':'0.25em',
								'width':'2.5em'
							})
							.text('明日')
							.on('click',function(){
								options.selected(null,new Date().calc('1 day').format('Y-m-d'));
								my.cover.hide();
							})
						)
					)
				}
				row
				.append(
					button.clone(true).css({
						'background-image':'url("https://tis2010.jp/library/kintone/images/prev.png")',
						'position':'absolute',
						'left':'0px',
						'top':'0px'
					})
					.on('click',function(){
						/* calc months */
						my.frommonth=my.frommonth.calc('-'+options.span.toString()+' month').calc('first-of-month');
						/* display calendar */
						my.show();
					})
				)
				.append(
					button.clone(true).css({
						'background-image':'url("https://tis2010.jp/library/kintone/images/next.png")',
						'position':'absolute',
						'right':'0px',
						'top':'0px'
					})
					.on('click',function(){
						/* calc months */
						my.frommonth=my.frommonth.calc(options.span.toString()+' month').calc('first-of-month');
						/* display calendar */
						my.show();
					})
				);
				return row;
			})(div.clone(true).css({
				'height':calendarparams.cells.height.toString()+'px',
				'left':'0px',
				'position':'absolute',
				'top':calendarparams.cells.height.toString()+'px',
				'z-index':options.span+2,
				'width':'100%'
			}))
		);
		this.contents=div.clone(true).css({
			'overflow':'auto',
			'padding':'0px 5px',
			'white-space':'nowrap',
			'width':'100%'
		});
		this.buttonblock=div.clone(true).css({
			'bottom':'0px',
			'height':(calendarparams.cells.height*1.5).toString()+'px',
			'left':'0px',
			'line-height':(calendarparams.cells.height*1.5).toString()+'px',
			'padding':'0px',
			'position':'absolute',
			'text-align':'center',
			'width':'100%',
			'z-index':options.span+3
		})
		.append(
			button.clone(true).css({
				'border':'1px solid #C9C9C9',
				'border-radius':'3px',
				'margin':'0px 5px',
				'width':'6em'
			})
			.attr('id','ok')
			.text('OK')
		)
		.append(
			button.clone(true).css({
				'border':'1px solid #C9C9C9',
				'border-radius':'3px',
				'margin':'0px 5px',
				'width':'6em'
			})
			.attr('id','cancel')
			.text('Cancel')
		);
		/* create calendar */
		for (var i=0;i<options.span;i++)
		{
			this.calendars.push(
				div.clone(true).css({
					'display':'inline-block',
					'height':calendarparams.height.toString()+'px',
					'padding-left':calendarparams.margin.left.toString()+'px',
					'padding-right':calendarparams.margin.right.toString()+'px',
					'padding-top':calendarparams.margin.top.toString()+'px',
					'padding-bottom':calendarparams.margin.bottom.toString()+'px',
					'width':calendarparams.width.toString()+'px'
				})
				.append(table.clone(true).css({'box-sizing':'border-box'}))
			);
			/* create cells */
			for (var i2=0;i2<week.length*calendarparams.rows;i2++)
			{
				var calendar=this.calendars[i].find('table');
				if (i2%week.length==0) calendar.append($('<tr>'));
				calendar.find('tr').last()
				.append(
					$('<td>').css({
						'border':'1px solid #C9C9C9',
						'box-sizing':'border-box',
						'color':options.normal.fore,
						'font-size':'13px',
						'height':calendarparams.cells.height.toString()+'px',
						'line-height':calendarparams.cells.height.toString()+'px',
						'margin':'0px',
						'padding':'0px',
						'text-align':'center',
						'width':calendarparams.cells.width.toString()+'px'
					})
					.on('click',function(){
						if ($.isNumeric($(this).text()))
						{
							var month=new Date(($(this).closest('table').find('tr').first().find('td').eq(0).text()+'-01').dateformat());
							var value=month.calc((parseInt($(this).text())-1).toString()+' day');
							if (options.multi)
							{
								var index=-1;
								for (var i3=0;i3<my.activedates.length;i3++) if (value.format('Y-m-d')==my.activedates[i3].format('Y-m-d')) index=i3;
								if (index>-1)
								{
									my.activedates.splice(index,1);
									switch (value.getDay())
									{
										case 0:
											//sunday's style
											$(this).css(my.params.sundaystyle);
											break;
										case 6:
											//saturday's style
											$(this).css(my.params.saturdaystyle);
											break;
										default:
											//normal style
											$(this).css(my.params.normalstyle);
											break;
									}
									//today's style
									if(value.format('Y-m-d')==new Date().format('Y-m-d')) $(this).css(my.params.todaystyle);
								}
								else
								{
									my.activedates.push(value);
									$(this).css(my.params.activestyle);
								}
							}
							else
							{
								if (options.selected!=null) options.selected($(this).closest('td'),value.format('Y-m-d'));
								my.cover.hide();
							}
						}
					})
				);
			}
			/* create header */
			calendar.find('tr').eq(0).find('td').css({'border':'none','cursor':'pointer'});
			calendar.find('tr').eq(0).find('td').each(function(index){if (index>0) $(this).remove();});
			calendar.find('tr').eq(0).find('td').eq(0).attr('colspan',week.length).css('cursor','default');
			calendar.find('tr').eq(1).find('td').each(function(index){$(this).text(week[index]);});
			calendar.find('tr:gt(0)').find('td').eq(0).css({'background-color':options.sunday.back,'color':options.sunday.fore});
			calendar.find('tr:gt(0)').find('td').eq(6).css({'background-color':options.saturday.back,'color':options.saturday.fore});
		}
		/* append elements */
		$.each(this.calendars,function(index){my.contents.append(my.calendars[index]);});
		this.container.append(this.contents);
		if (options.multi) this.container.append(this.buttonblock);
		this.cover.append(this.container);
		options.container.append(this.cover);
	};
	Calendar.prototype={
		/* display calendar */
		show:function(options){
			var options=$.extend(true,{
				activedate:null,
				activedates:null,
				buttons:{}
			},options);
			var my=this;
			var calendar=null;
			var month=null;
			var params=this.params;
			if (options.activedate!=null || options.activedates!=null)
			{
				var monthchanged=false;
				var selections=(options.activedate!=null)?[options.activedate.format('Y-m-d')]:((options.activedates!=null)?options.activedates:[]);
				/* setup active day and display month */
				this.activedates=[];
				for (var i=0;i<selections.length;i++)
				{
					if (selections[i].match(/^[0-9]{4}(-|\/){1}[0-1]?[0-9]{1}(-|\/){1}[0-3]?[0-9]{1}$/g)!=null)
					{
						this.activedates.push(new Date(selections[i].replace(/-/g,'\/')));
						if (!monthchanged) {this.frommonth=new Date(selections[i].replace(/-/g,'\/')).calc('first-of-month');monthchanged=true;}
					}
				}
				if (!monthchanged) this.frommonth=new Date().calc('first-of-month');
			}
			/* buttons callback */
			$.each(options.buttons,function(key,values){
				if (my.buttonblock.find('button#'+key).size())
					my.buttonblock.find('button#'+key).off('click').on('click',function(){
						if (values!=null)
						{
							var selections=[];
							for (var i=0;i<my.activedates.length;i++) selections.push(my.activedates[i].format('Y-m-d'));
							values(selections);
						}
					});
			});
			for (var i=0;i<params.span;i++)
			{
				calendar=this.calendars[i].find('table');
				month=this.frommonth.calc(i.toString()+' month');
				/* initialize header title */
				calendar.find('tr').first().find('td').eq(0).text(month.format('Y-m'));
				/* setup cells */
				calendar.find('tr:gt(1)').find('td').each(function(index){
					var display=index-month.getDay();
					var day=month.calc(display.toString()+' day');
					var style=params.normalstyle
					/* not process less than one day this month */
					if (display<0) {$(this).css(style).html('&nbsp;');return;}
					/* not processing beyond the next month 1 day */
					if (day.format('Y-m')!=month.format('Y-m')) {$(this).css(style).html('&nbsp;');return;}
					switch ((index+1)%7)
					{
						case 0:
							//saturday's style
							style=params.saturdaystyle;
							break;
						case 1:
							//sunday's style
							style=params.sundaystyle;
							break;
					}
					//today's style
					if(day.format('Y-m-d')==new Date().format('Y-m-d')) style=params.todaystyle
					//activedate's style
					for (var i2=0;i2<my.activedates.length;i2++) if (day.format('Y-m-d')==my.activedates[i2].format('Y-m-d')) style=params.activestyle;
					style['cursor']='pointer';
					$(this).css(style).text((display+1).toString());
				});
			}
			this.cover.show();
		},
		/* hide calendar */
		hide:function(){
			this.cover.hide();
		},
		/* redisplay referer */
		unhide:function(){
			this.cover.show();
		}
	};
	return new Calendar($.extend(true,{
		container:$(this),
		multi:false,
		selected:null,
		closed:null,
		span:1,
		active:{back:'#FFB46E',fore:'#2B2B2B'},
		normal:{back:'#FFFFFF',fore:'#2B2B2B'},
		saturday:{back:'#FFFFFF',fore:'#69B4C8'},
		sunday:{back:'#FFFFFF',fore:'#FA8273'},
		today:{back:'#69B4C8',fore:'#2B2B2B'}
	},options));
};
jTis.fn.colorSelector=function(colors,input,callback){
	return $(this).each(function(){
		var target=$(this);
		var colorbuttons=null;
		var colorinput=null;
		var colorlist=null;
		var position={x:0,y:0};
		colorbuttons=$('<div>').css({
			'box-sizing':'border-box',
			'height':'calc(100% - 3em)',
			'overflow-x':'hidden',
			'overflow-y':'scroll',
			'margin-bottom':'3em',
			'width':'100%',
			'z-index':'1',
		});
		colorinput=$('<div>').css({
			'background-color':'#F3F3F3',
			'border-bottom-left-radius':'0.25em',
			'border-bottom-right-radius':'0.25em',
			'bottom':'0px',
			'box-sizing':'border-box',
			'left':'0px',
			'margin':'0px',
			'padding':'0.5em',
			'position':'absolute',
			'width':'100%',
			'z-index':'2'
		})
		.append($('<input type="text" placeholder="16進数カラーコードを入力">').css({
			'border':'1px solid #DCDCDC',
			'border-radius':'0.25em',
			'box-sizing':'border-box',
			'line-height':'2em',
			'height':'2em',
			'margin':'0px',
			'outline':'0px',
			'padding':'0px 0.25em',
			'width':'calc(100% - 5.25em)',
		}))
		.append($('<button>').css({
			'background-color':'transparent',
			'border':'1px solid #DCDCDC',
			'border-radius':'0.25em',
			'box-sizing':'border-box',
			'cursor':'pointer',
			'line-height':'2em',
			'margin':'0px 0px 0px 0.25em',
			'outline':'none',
			'padding':'0px 0.25em',
			'text-align':'center',
			'width':'5em'
		}).on('click',function(){
			if (colorinput.find('input').val().length==0) alert('カラーコードを入力して下さい。');
			else
			{
				target.css({'background-color':'#'+colorinput.find('input').val().replace('#','')});
				input.val(colorinput.find('input').val().replace('#',''));
				colorlist.hide();
				if (callback) callback();
			}
		}).text('OK'));
		colorlist=$('<div class="colorlist">').css({
			'background-color':'#F3F3F3',
			'border':'1px solid #DCDCDC',
			'border-radius':'0.25em',
			'box-shadow':'0px 0px 2px rgba(0,0,0,0.5)',
			'height':'400px',
			'left':'50%',
			'margin':'0px',
			'max-height':'calc(100% - 2em)',
			'max-width':'calc(100% - 2em)',
			'overflow':'hidden',
			'padding':'2px',
			'position':'fixed',
			'text-align':'left',
			'top':'50%',
			'z-index':'9999999',
			'width':'400px',
			'-webkit-transform':'translate(-50%,-50%)',
			'-ms-transform':'translate(-50%,-50%)',
			'transform':'translate(-50%,-50%)'
		}).on('touchstart mousedown',function(e){e.stopPropagation();}).hide();
		target.css({'background-color':'#'+input.val()})
		.off('touchstart.selector mousedown.selector')
		.on('touchstart.selector mousedown.selector',function(e){
			$('div.colorlist').hide();
			colorlist.show();
			return false;
		});
		for (var i=0;i<colors.length;i++)
		{
			colorbuttons.append(
				$('<div>').css({
					'background-color':colors[i],
					'cursor':'pointer',
					'display':'inline-block',
					'padding-top':'calc(25% - 4px)',
					'margin':'2px',
					'width':'calc(25% - 4px)'
				})
				.on('touchstart mousedown',function(e){e.stopPropagation();})
				.on('click',function(){
					var index=colorbuttons.find('div').index($(this));
					target.css({'background-color':colors[index]});
					input.val(colors[index].replace('#',''));
					colorlist.hide();
					if (callback) callback();
				})
			);
		}
		colorlist.append(colorbuttons);
		colorlist.append(colorinput);
		$('body').on('touchstart mousedown',function(){colorlist.hide();}).append(colorlist);
	});
}
jTis.fn.conditionsform=function(options){
	var ConditionsForm=function(options){
		var options=$.extend(true,{
			app:kintone.app.getId(),
			container:null,
			useloginuser:false,
			fields:{}
		},options);
		/* valiable */
		var my=this;
		/* property */
		this.app=options.app;
		this.fields=options.fields;
		this.dialog=createdialog('standard',900,800);
		this.contents=this.dialog.contents;
		this.groupsource=null;
		this.statussource=null;
		this.organizationsource=null;
		this.usersource=null;
		this.referer={};
		/* append elements */
		this.dialog.lists.find('tbody').append(
			$('<tr>')
			.append(
				cell.clone(true).css({'border':'none','border-bottom':'1px dotted #C9C9C9','padding':'5px','width':'150px'})
				.append(select.clone(true).addClass('field').css({'width':'100%'}))
			)
			.append(
				cell.clone(true).css({'border':'none','border-bottom':'1px dotted #C9C9C9','padding':'5px','width':'150px'})
				.append(select.clone(true).addClass('comp').css({'width':'100%'}))
			)
			.append(
				cell.clone(true).addClass('value').css({'border':'none','border-bottom':'1px dotted #C9C9C9','padding':'5px','width':'calc(100% - 360px)'})
			)
			.append(
				cell.clone(true).css({'border':'none','border-bottom':'1px dotted #C9C9C9','padding':'5px 0px','width':'30px'})
				.append(
					$('<img src="https://tis2010.jp/library/kintone/images/add.png" class="add" alt="追加" title="追加">')
					.css({
						'cursor':'pointer',
						'vertical-align':'top',
						'width':'100%'
					})
				)
			)
			.append(
				cell.clone(true).css({'border':'none','border-bottom':'1px dotted #C9C9C9','padding':'5px 0px','width':'30px'})
				.append(
					$('<img src="https://tis2010.jp/library/kintone/images/close.png" class="del" alt="削除" title="削除">')
					.css({
						'cursor':'pointer',
						'vertical-align':'top',
						'width':'100%'
					})
				)
			)
		);
		this.conditiontable=this.dialog.lists.adjustabletable({
			add:'img.add',
			del:'img.del',
			addcallback:function(row){
				$('.field',row).on('change',function(){
					$('.comp',row).empty().append($('<option>').attr('value','').text(''));
					if ($(this).val())
					{
						var container=row;
						var fieldinfo=my.fields[$(this).val()];
						var fieldoptions=[];
						var receiver=null;
						var calcvalue=(function(){
							var res=div.clone(true).css({
								'display':'none',
								'line-height':'30px'
							})
							.append(textline.clone(true).addClass('receiverspan').css({'margin':'0px 5px','text-align':'right','width':'5em'}))
							.append(select.clone(true).addClass('receiverunit'));
							$('.receiverunit',res).append($('<option>').attr('value','d').text('日'));
							$('.receiverunit',res).append($('<option>').attr('value','m').text('月'));
							$('.receiverunit',res).append($('<option>').attr('value','y').text('年'));
							return res;
						})();
						var fixedvalue=select.clone(true).addClass('fixed').css({'width':'100px'}).on('change',function(){
							$('.receiver',row).val($(this).val());
							if ($(this).val())
							{
								$('.receiver',row).closest('div').hide();
								if ($(this).val().match(/^FROM/g)) $('.receiverspan',row).closest('div').css({'display':'inline-block'});
								else $('.receiverspan',row).closest('div').hide();
							}
							else
							{
								$('.receiver',row).closest('div').css({'display':'inline-block'});
								$('.receiverspan',row).closest('div').hide();
							}
						});
						var setupdatereceiver=function(row,receiver,fixedvalue,calcvalue){
							$('.comp',row)
							.append($('<option>').attr('value','0').text('等しい'))
							.append($('<option>').attr('value','1').text('等しくない'))
							.append($('<option>').attr('value','2').text('以前'))
							.append($('<option>').attr('value','3').text('より前'))
							.append($('<option>').attr('value','4').text('以降'))
							.append($('<option>').attr('value','5').text('より後'));
							fixedvalue
							.append($('<option>').attr('value','').text('日付指定'))
							.append($('<option>').attr('value','TODAY').text('今日'))
							.append($('<option>').attr('value','LASTWEEK').text('先週'))
							.append($('<option>').attr('value','THISWEEK').text('今週'))
							.append($('<option>').attr('value','LASTMONTH').text('先月'))
							.append($('<option>').attr('value','THISMONTH').text('今月'))
							.append($('<option>').attr('value','THISYEAR').text('今年'))
							.append($('<option>').attr('value','FROMTODAY').text('今日から'))
							.append($('<option>').attr('value','FROMTHISMONTH').text('今月初日から'))
							.append($('<option>').attr('value','FROMTHISYEAR').text('今年初日から'));
							receiver=referer.clone(true);
							$('.label',receiver).closest('div').css({'width':'calc(100% - 100px)'});
							$('.search',receiver).on('click',function(){
								var target=$(this);
								/* day pickup */
								var calendar=$('body').calendar({
									selected:function(cell,value){
										$('.label',row).text(value);
										$('.receiver',row).val(value);
									}
								});
								calendar.show({activedate:new Date($('.label',row).text().dateformat())});
							});
							$('.clear',receiver).on('click',function(){
								var target=$(this);
								$('.label',row).text('');
								$('.receiver',row).val('');
							});
							$('.value',row).append(fixedvalue);
							$('.value',row).append(calcvalue);
							$('.value',row).append(receiver);
						};
						var setupdatetimereceiver=function(row,receiver,fixedvalue,calcvalue){
							$('.comp',row)
							.append($('<option>').attr('value','0').text('等しい'))
							.append($('<option>').attr('value','1').text('等しくない'))
							.append($('<option>').attr('value','2').text('以前'))
							.append($('<option>').attr('value','3').text('より前'))
							.append($('<option>').attr('value','4').text('以降'))
							.append($('<option>').attr('value','5').text('より後'));
							fixedvalue
							.append($('<option>').attr('value','').text('日付指定'))
							.append($('<option>').attr('value','NOW').text('当時刻'))
							.append($('<option>').attr('value','TODAY').text('今日'))
							.append($('<option>').attr('value','LASTWEEK').text('先週'))
							.append($('<option>').attr('value','THISWEEK').text('今週'))
							.append($('<option>').attr('value','LASTMONTH').text('先月'))
							.append($('<option>').attr('value','THISMONTH').text('今月'))
							.append($('<option>').attr('value','THISYEAR').text('今年'))
							.append($('<option>').attr('value','FROMTODAY').text('今日から'))
							.append($('<option>').attr('value','FROMTHISMONTH').text('今月初日から'))
							.append($('<option>').attr('value','FROMTHISYEAR').text('今年初日から'));
							receiver=referer.clone(true).append(time.clone(true));
							$('.label',receiver).closest('div').css({'width':'calc(100% - 100px)'});
							$('.label',receiver).css({'width':'calc(100% - 135px)'});
							$('.search',receiver).on('click',function(){
								var target=$(this);
								/* day pickup */
								var calendar=$('body').calendar({
									selected:function(cell,value){
										$('.label',row).text(value);
										$('.receiver',row).val(my.datetimevalue(row));
									}
								});
								calendar.show({activedate:new Date($('.label',row).text().dateformat())});
							});
							$('.clear',receiver).on('click',function(){
								var target=$(this);
								$('.label',row).text('');
								$('.receiver',row).val('');
							});
							$('.receiverhour',receiver).on('change',function(){
								$('.receiver',row).val(my.datetimevalue(row));
							});
							$('.receiverminute',receiver).on('change',function(){
								$('.receiver',row).val(my.datetimevalue(row));
							});
							$('.value',row).append(fixedvalue);
							$('.value',row).append(calcvalue);
							$('.value',row).append(receiver);
						};
						$('.value',row).empty();
						switch (fieldinfo.type)
						{
							case 'CALC':
								switch(fieldinfo.format.toUpperCase())
								{
									case 'NUMBER':
									case 'NUMBER_DIGIT':
										$('.comp',row)
										.append($('<option>').attr('value','0').text('等しい'))
										.append($('<option>').attr('value','1').text('等しくない'))
										.append($('<option>').attr('value','2').text('以下'))
										.append($('<option>').attr('value','3').text('以上'));
										receiver=textline.clone(true).addClass('receiver');
										receiver.css({'text-align':'right'});
										$('.value',row).append(receiver);
										break;
									case 'DATE':
										setupdatereceiver(row,receiver,fixedvalue,calcvalue);
										break;
									case 'DATETIME':
									case 'DAY_HOUR_MINUTE':
										setupdatetimereceiver(row,receiver,fixedvalue,calcvalue);
										break;
									case 'TIME':
									case 'HOUR_MINUTE':
										$('.comp',row)
										.append($('<option>').attr('value','0').text('等しい'))
										.append($('<option>').attr('value','1').text('等しくない'))
										.append($('<option>').attr('value','2').text('以前'))
										.append($('<option>').attr('value','3').text('より前'))
										.append($('<option>').attr('value','4').text('以降'))
										.append($('<option>').attr('value','5').text('より後'));
										receiver=time.clone(true);
										receiver.append($('<input type="hidden" class="receiver">').val('00:00'))
										$('.receiverhour',receiver).on('change',function(){
											$('.receiver',row).val(my.timevalue(row));
										});
										$('.receiverminute',receiver).on('change',function(){
											$('.receiver',row).val(my.timevalue(row));
										});
										$('.value',row).append(receiver);
										break;
								}
								break;
							case 'CHECK_BOX':
							case 'DROP_DOWN':
							case 'MULTI_SELECT':
							case 'RADIO_BUTTON':
								$('.comp',row)
								.append($('<option>').attr('value','0').text('次のいずれかを含む'))
								.append($('<option>').attr('value','1').text('次のいずれも含まない'));
								fieldoptions=[fieldinfo.options.length];
								$.each(fieldinfo.options,function(key,values){
									fieldoptions[values.index]=values.label;
								});
								for (var i=0;i<fieldoptions.length;i++)
								{
									receiver=checkbox.clone(true);
									$('.label',receiver).html(fieldoptions[i]);
									$('.receiver',receiver).attr('id',fieldoptions[i]).val(fieldoptions[i]);
									$('.value',row).append(receiver);
								}
								break;
							case 'CREATED_TIME':
							case 'DATETIME':
							case 'UPDATED_TIME':
								setupdatetimereceiver(row,receiver,fixedvalue,calcvalue);
								break;
							case 'CREATOR':
							case 'MODIFIER':
							case 'STATUS_ASSIGNEE':
							case 'USER_SELECT':
								$('.comp',row)
								.append($('<option>').attr('value','0').text('次のいずれかを含む'))
								.append($('<option>').attr('value','1').text('次のいずれも含まない'));
								/* load user datas */
								if (my.usersource==null)
								{
									my.usersource=[];
									$.loadusers(function(records){
										records.sort(function(a,b){
											if(parseInt(a.id)<parseInt(b.id)) return -1;
											if(parseInt(a.id)>parseInt(b.id)) return 1;
											return 0;
										});
										if (options.useloginuser) my.usersource.push({value:'LOGINUSER',text:'ログインユーザー'});
										$.each(records,function(index,values){
											my.usersource.push({value:values.code,text:values.name});
										});
									});
								}
								receiver=referer.clone(true);
								$('.search',receiver).on('click',function(){
									var target=$(this);
									my.selectbox.show({
										datasource:my.usersource,
										buttons:{
											ok:function(selection){
												$('.label',row).text(Object.values(selection).join(','));
												$('.receiver',row).val(Object.keys(selection).join(','));
												/* close the selectbox */
												my.selectbox.hide();
											},
											cancel:function(){
												/* close the selectbox */
												my.selectbox.hide();
											}
										},
										selected:$('.receiver',row).val().split(',')
									});
								});
								$('.clear',receiver).on('click',function(){
									var target=$(this);
									$('.label',row).text('');
									$('.receiver',row).val('');
								});
								$('.value',row).append(receiver);
								break;
							case 'DATE':
								setupdatereceiver(row,receiver,fixedvalue,calcvalue);
								break;
							case 'GROUP_SELECT':
								$('.comp',row)
								.append($('<option>').attr('value','0').text('次のいずれかを含む'))
								.append($('<option>').attr('value','1').text('次のいずれも含まない'));
								/* load group datas */
								if (my.groupsource==null)
								{
									my.groupsource=[];
									$.loadgroups(function(records){
										records.sort(function(a,b){
											if(parseInt(a.id)<parseInt(b.id)) return -1;
											if(parseInt(a.id)>parseInt(b.id)) return 1;
											return 0;
										});
										$.each(records,function(index,values){
											my.groupsource.push({value:values.code,text:values.name});
										});
									});
								}
								receiver=referer.clone(true);
								$('.search',receiver).on('click',function(){
									var target=$(this);
									my.selectbox.show({
										datasource:my.groupsource,
										buttons:{
											ok:function(selection){
												$('.label',row).text(Object.values(selection).join(','));
												$('.receiver',row).val(Object.keys(selection).join(','));
												/* close the selectbox */
												my.selectbox.hide();
											},
											cancel:function(){
												/* close the selectbox */
												my.selectbox.hide();
											}
										},
										selected:$('.receiver',row).val().split(',')
									});
								});
								$('.clear',receiver).on('click',function(){
									var target=$(this);
									$('.label',row).text('');
									$('.receiver',row).val('');
								});
								$('.value',row).append(receiver);
								break;
							case 'LINK':
							case 'SINGLE_LINE_TEXT':
								$('.comp',row)
								.append($('<option>').attr('value','0').text('等しい'))
								.append($('<option>').attr('value','1').text('等しくない'))
								.append($('<option>').attr('value','2').text('次のキーワードを含む'))
								.append($('<option>').attr('value','3').text('次のキーワードを含まない'));
								if (fieldinfo.lookup)
								{
									receiver=referer.clone(true);
									$('.key',receiver).val(fieldinfo.lookup.relatedKeyField);
									if (fieldinfo.lookup.lookupPickerFields.length!=0) $('.picker',receiver).val(fieldinfo.lookup.lookupPickerFields.join(','));
									else $('.picker',receiver).val(fieldinfo.lookup.relatedKeyField);
									$('.search',receiver).on('click',function(){
										var target=$(this);
										my.referer[$('.field',row).val()].show({
											buttons:{
												cancel:function(){
													/* close the reference box */
													my.referer[$('.field',row).val()].hide();
												}
											},
											callback:function(row){
												var labels=[];
												var pickers=$('.picker',container).val().split(',');
												for (var i2=0;i2<pickers.length;i2++) labels.push(row.find('#'+pickers[i2]).val());
												$('.label',container).html(labels.join('/'));
												$('.receiver',container).val(row.find('#'+$('.key',container).val()).val());
												/* close the reference box */
												my.referer[$('.field',container).val()].hide();
											}
										});
									});
									$('.clear',receiver).on('click',function(){
										var target=$(this);
										$('.label',row).text('');
										$('.receiver',row).val('');
									});
									/* create reference box */
									(function(fieldinfo){
										kintone.api(kintone.api.url('/k/v1/app/form/fields',true),'GET',{app:fieldinfo.lookup.relatedApp.app},function(resp){
											my.referer[fieldinfo.code]=$('body').referer({
												displaytext:((fieldinfo.lookup.lookupPickerFields.length!=0)?fieldinfo.lookup.lookupPickerFields:[fieldinfo.lookup.relatedKeyField]),
												searchinfo:{
													app:fieldinfo.lookup.relatedApp.app,
													query:fieldinfo.lookup.filterCond,
													sort:fieldinfo.lookup.sort,
													fieldinfos:$.fieldparallelize(resp.properties)
												}
											});
											my.referer[fieldinfo.code].dialog.cover.css({'z-index':'1000000'});
										},function(error){});
									})(fieldinfo);
								}
								else receiver=textline.clone(true).addClass('receiver');
								$('.value',row).append(receiver);
								break;
							case 'MULTI_LINE_TEXT':
							case 'RICH_TEXT':
								$('.comp',row)
								.append($('<option>').attr('value','0').text('次のキーワードを含む'))
								.append($('<option>').attr('value','1').text('次のキーワードを含まない'));
								receiver=textline.clone(true).addClass('receiver');
								$('.value',row).append(receiver);
								break;
							case 'NUMBER':
							case 'RECORD_NUMBER':
								$('.comp',row)
								.append($('<option>').attr('value','0').text('等しい'))
								.append($('<option>').attr('value','1').text('等しくない'))
								.append($('<option>').attr('value','2').text('以下'))
								.append($('<option>').attr('value','3').text('以上'));
								if (fieldinfo.lookup)
								{
									receiver=referer.clone(true);
									$('.key',receiver).val(fieldinfo.lookup.relatedKeyField);
									if (fieldinfo.lookup.lookupPickerFields.length!=0) $('.picker',receiver).val(fieldinfo.lookup.lookupPickerFields.join(','));
									else $('.picker',receiver).val(fieldinfo.lookup.relatedKeyField);
									$('.search',receiver).on('click',function(){
										var target=$(this);
										my.referer[$('.field',row).val()].show({
											buttons:{
												cancel:function(){
													/* close the reference box */
													my.referer[$('.field',row).val()].hide();
												}
											},
											callback:function(row){
												var labels=[];
												var pickers=$('.picker',container).val().split(',');
												for (var i2=0;i2<pickers.length;i2++) labels.push(row.find('#'+pickers[i2]).val());
												$('.label',container).html(labels.join('/'));
												$('.receiver',container).val(row.find('#'+$('.key',container).val()).val());
												/* close the reference box */
												my.referer[$('.field',container).val()].hide();
											}
										});
									});
									$('.clear',receiver).on('click',function(){
										var target=$(this);
										$('.label',row).text('');
										$('.receiver',row).val('');
									});
									/* create reference box */
									(function(fieldinfo){
										kintone.api(kintone.api.url('/k/v1/app/form/fields',true),'GET',{app:fieldinfo.lookup.relatedApp.app},function(resp){
											my.referer[fieldinfo.code]=$('body').referer({
												displaytext:((fieldinfo.lookup.lookupPickerFields.length!=0)?fieldinfo.lookup.lookupPickerFields:[fieldinfo.lookup.relatedKeyField]),
												searchinfo:{
													app:fieldinfo.lookup.relatedApp.app,
													query:fieldinfo.lookup.filterCond,
													sort:fieldinfo.lookup.sort,
													fieldinfos:$.fieldparallelize(resp.properties)
												}
											});
											my.referer[fieldinfo.code].dialog.cover.css({'z-index':'1000000'});
										},function(error){});
									})(fieldinfo);
								}
								else
								{
									receiver=textline.clone(true).addClass('receiver');
									receiver.css({'text-align':'right'});
								}
								$('.value',row).append(receiver);
								break;
							case 'ORGANIZATION_SELECT':
								$('.comp',row)
								.append($('<option>').attr('value','0').text('次のいずれかを含む'))
								.append($('<option>').attr('value','1').text('次のいずれも含まない'));
								/* load organization datas */
								if (my.organizationsource==null)
								{
									my.organizationsource=[];
									$.loadorganizations(function(records){
										records.sort(function(a,b){
											if(parseInt(a.id)<parseInt(b.id)) return -1;
											if(parseInt(a.id)>parseInt(b.id)) return 1;
											return 0;
										});
										$.each(records,function(index,values){
											my.organizationsource.push({value:values.code,text:values.name});
										});
									});
								}
								receiver=referer.clone(true);
								$('.search',receiver).on('click',function(){
									var target=$(this);
									my.selectbox.show({
										datasource:my.organizationsource,
										buttons:{
											ok:function(selection){
												$('.label',row).text(Object.values(selection).join(','));
												$('.receiver',row).val(Object.keys(selection).join(','));
												/* close the selectbox */
												my.selectbox.hide();
											},
											cancel:function(){
												/* close the selectbox */
												my.selectbox.hide();
											}
										},
										selected:$('.receiver',row).val().split(',')
									});
								});
								$('.clear',receiver).on('click',function(){
									var target=$(this);
									$('.label',row).text('');
									$('.receiver',row).val('');
								});
								$('.value',row).append(receiver);
								break;
							case 'STATUS':
								$('.comp',row)
								.append($('<option>').attr('value','0').text('次のいずれかを含む'))
								.append($('<option>').attr('value','1').text('次のいずれも含まない'));
								/* load group datas */
								if (my.statussource==null)
								{
									my.statussource=[];
									kintone.api(kintone.api.url('/k/v1/app/status',true),'GET',{app:my.app},function(resp){
										my.statussource=[Object.keys(resp.states).length];
										$.each(resp.states,function(key,values){
											my.statussource[values.index]={value:key,text:values.name};
										});
									},function(error){});
								}
								receiver=referer.clone(true);
								$('.search',receiver).on('click',function(){
									var target=$(this);
									my.selectbox.show({
										datasource:my.statussource,
										buttons:{
											ok:function(selection){
												$('.label',row).text(Object.values(selection).join(','));
												$('.receiver',row).val(Object.keys(selection).join(','));
												/* close the selectbox */
												my.selectbox.hide();
											},
											cancel:function(){
												/* close the selectbox */
												my.selectbox.hide();
											}
										},
										selected:$('.receiver',row).val().split(',')
									});
								});
								$('.clear',receiver).on('click',function(){
									var target=$(this);
									$('.label',row).text('');
									$('.receiver',row).val('');
								});
								$('.value',row).append(receiver);
								break;
							case 'TIME':
								$('.comp',row)
								.append($('<option>').attr('value','0').text('等しい'))
								.append($('<option>').attr('value','1').text('等しくない'))
								.append($('<option>').attr('value','2').text('以前'))
								.append($('<option>').attr('value','3').text('より前'))
								.append($('<option>').attr('value','4').text('以降'))
								.append($('<option>').attr('value','5').text('より後'));
								receiver=time.clone(true);
								receiver.append($('<input type="hidden" class="receiver">').val('00:00'))
								$('.receiverhour',receiver).on('change',function(){
									$('.receiver',row).val(my.timevalue(row));
								});
								$('.receiverminute',receiver).on('change',function(){
									$('.receiver',row).val(my.timevalue(row));
								});
								$('.value',row).append(receiver);
								break;
						}
					}
					else $('.value',row).empty();
				});
			},
		});
		$('.field',this.conditiontable.template).empty().append($('<option>').attr('value','').text(''));
		$.each(this.fields,function(key,values){
			if (values.type=='CATEGORY') return true;
			if (values.type=='FILE') return true;
			if (values.type=='GROUP') return true;
			if (values.type=='REFERENCE_TABLE') return true;
			if (values.type=='SUBTABLE') return true;
			$('.field',my.conditiontable.template).append($('<option>').attr('value',values.code).text(values.label));
		});
		this.dialog.contents.append(this.dialog.lists);
		this.dialog.container.append(this.dialog.contents);
		this.dialog.container.append(
			this.dialog.footer
			.append(button.clone(true).attr('id','ok').text('OK'))
			.append(button.clone(true).attr('id','cancel').text('Cancel').on('click',function(){
				my.hide();
			}))
		);
		this.dialog.cover.append(this.dialog.container);
		options.container.append(this.dialog.cover);
		/* create selectbox */
		this.selectbox=$('body').multiselect();
	};
	ConditionsForm.prototype={
		/* create datetime value */
		datetimevalue:function(container){
			var date=container.find('.label').text();
			var receiverhour=container.find('.receiverhour');
			var receiverminute=container.find('.receiverminute');
			if (date.length==0) return '';
			else return date+'T'+receiverhour.val()+':'+receiverminute.val()+':00'+$.timezome();
		},
		/* create time value */
		timevalue:function(container){
			var receiverhour=container.find('.receiverhour');
			var receiverminute=container.find('.receiverminute');
			return receiverhour.val()+':'+receiverminute.val();
		},
		/* display form */
		show:function(options,callback){
			var options=$.extend(true,{
				fieldinfos:this.fields,
				conditions:[]
			},options);
			var my=this;
			var row=null;
			$('#ok',this.dialog.footer).off('click').on('click',function(){
				var res=[];
				for (var i=0;i<my.conditiontable.rows.length;i++)
				{
					row=my.conditiontable.rows.eq(i);
					if (!$('.field',row).val()) continue;
					if (!$('.comp',row).val()) continue;
					var fieldinfo=options.fieldinfos[$('.field',row).val()];
					var receivevalue=$('.receiver',row).val();
					var receivevalues=[];
					switch (fieldinfo.type)
					{
						case 'CALC':
							switch(fieldinfo.format.toUpperCase())
							{
								case 'NUMBER':
								case 'NUMBER_DIGIT':
									switch ($('.comp',row).val())
									{
										case '2':
										case '3':
											if (!receivevalue) alert('値を入力して下さい。');
											if (!$.isNumeric(receivevalue)) alert('数値を入力して下さい。');
											break;
									}
									break;
							}
							if ($('.fixed',row).size())
							{
								if ($('.fixed',row).val().match(/^FROM/g))
								{
									res.push({
										field:$('.field',row).val(),
										comp:{code:$('.comp',row).val(),name:$('.comp option:selected',row).text()},
										label:$('.fixed option:selected',row).text()+$('.receiverspan',row).val()+$('.receiverunit option:selected',row).text(),
										value:$('.fixed',row).val()+$('.receiverspan',row).val()+$('.receiverunit',row).val()
									});
								}
								else
								{
									res.push({
										field:$('.field',row).val(),
										comp:{code:$('.comp',row).val(),name:$('.comp option:selected',row).text()},
										label:($('.fixed',row).val())?$('.fixed option:selected',row).text():receivevalue,
										value:receivevalue
									});
								}
							}
							else
							{
								res.push({
									field:$('.field',row).val(),
									comp:{code:$('.comp',row).val(),name:$('.comp option:selected',row).text()},
									label:receivevalue,
									value:receivevalue
								});
							}
							break;
						case 'CHECK_BOX':
						case 'DROP_DOWN':
						case 'MULTI_SELECT':
						case 'RADIO_BUTTON':
							$.each($('.receiver:checked',row),function(){receivevalues.push($(this).val());});
							res.push({
								field:$('.field',row).val(),
								comp:{code:$('.comp',row).val(),name:$('.comp option:selected',row).text()},
								label:receivevalues.join(','),
								value:receivevalues
							});
							break;
						case 'CREATOR':
						case 'GROUP_SELECT':
						case 'MODIFIER':
						case 'ORGANIZATION_SELECT':
						case 'STATUS_ASSIGNEE':
						case 'USER_SELECT':
						case 'STATUS':
							var values=receivevalue.split(',');
							for (var i2=0;i2<values.length;i2++) receivevalues.push(values[i2]);
							res.push({
								field:$('.field',row).val(),
								comp:{code:$('.comp',row).val(),name:$('.comp option:selected',row).text()},
								label:$('.label',row).text(),
								value:receivevalues
							});
							break;
						case 'NUMBER':
						case 'RECORD_NUMBER':
							switch ($('.comp',row).val())
							{
								case '2':
								case '3':
									if (!receivevalue) alert('値を入力して下さい。');
									if (!$.isNumeric(receivevalue)) alert('数値を入力して下さい。');
									break;
							}
							if (fieldinfo.lookup)
							{
								res.push({
									field:$('.field',row).val(),
									comp:{code:$('.comp',row).val(),name:$('.comp option:selected',row).text()},
									label:$('.label',row).text(),
									value:receivevalue
								});
							}
							else
							{
								res.push({
									field:$('.field',row).val(),
									comp:{code:$('.comp',row).val(),name:$('.comp option:selected',row).text()},
									label:receivevalue,
									value:receivevalue
								});
							}
							break;
						default:
							if (fieldinfo.lookup)
							{
								res.push({
									field:$('.field',row).val(),
									comp:{code:$('.comp',row).val(),name:$('.comp option:selected',row).text()},
									label:$('.label',row).text(),
									value:receivevalue
								});
							}
							else
							{
								if ($('.fixed',row).size())
								{
									if ($('.fixed',row).val().match(/^FROM/g))
									{
										res.push({
											field:$('.field',row).val(),
											comp:{code:$('.comp',row).val(),name:$('.comp option:selected',row).text()},
											label:$('.fixed option:selected',row).text()+$('.receiverspan',row).val()+$('.receiverunit option:selected',row).text(),
											value:$('.fixed',row).val()+$('.receiverspan',row).val()+$('.receiverunit',row).val()
										});
									}
									else
									{
										res.push({
											field:$('.field',row).val(),
											comp:{code:$('.comp',row).val(),name:$('.comp option:selected',row).text()},
											label:($('.fixed',row).val())?$('.fixed option:selected',row).text():receivevalue,
											value:receivevalue
										});
									}
								}
								else
								{
									res.push({
										field:$('.field',row).val(),
										comp:{code:$('.comp',row).val(),name:$('.comp option:selected',row).text()},
										label:receivevalue,
										value:receivevalue
									});
								}
							}
							break;
					}
				}
				callback(res);
				my.hide();
			});
			this.conditiontable.clearrows();
			for (var i=0;i<options.conditions.length;i++)
			{
				var condition=options.conditions[i];
				var fieldinfo=options.fieldinfos[condition.field];
				var setupdatevalue=function(row,condition){
					switch (condition.value)
					{
						case 'TODAY':
						case 'LASTWEEK':
						case 'THISWEEK':
						case 'LASTMONTH':
						case 'THISMONTH':
						case 'THISYEAR':
							$('.fixed',row).val(condition.value);
							$('.receiver',row).val(condition.value);
							$('.receiver',row).closest('div').hide();
							$('.receiverspan',row).closest('div').hide();
							break;
						default:
							if (condition.value.match(/^FROM/g))
							{
								$('.fixed',row).val(condition.value.replace(/-?[0-9]+(d|m|y)$/g,''));
								$('.receiverspan',row).val(condition.value.replace(/[^0-9-]+/g,''));
								$('.receiverunit',row).val(condition.value.slice(-1));
								$('.receiver',row).closest('div').hide();
								$('.receiverspan',row).closest('div').css({'display':'inline-block'});
							}
							else
							{
								$('.label',row).text(condition.value);
								$('.receiver',row).val(condition.value);
								$('.receiver',row).closest('div').css({'display':'inline-block'});
								$('.receiverspan',row).closest('div').hide();
							}
							break;
					}
				};
				var setupdatetimevalue=function(row,condition){
					switch (condition.value)
					{
						case 'NOW':
						case 'TODAY':
						case 'LASTWEEK':
						case 'THISWEEK':
						case 'LASTMONTH':
						case 'THISMONTH':
						case 'THISYEAR':
							$('.fixed',row).val(condition.value);
							$('.receiver',row).val(condition.value);
							$('.receiver',row).closest('div').hide();
							$('.receiverspan',row).closest('div').hide();
							break;
						default:
							if (condition.value.match(/^FROM/g))
							{
								$('.fixed',row).val(condition.value.replace(/-?[0-9]+(d|m|y)$/g,''));
								$('.receiverspan',row).val(condition.value.replace(/[^0-9-]+/g,''));
								$('.receiverunit',row).val(condition.value.slice(-1));
								$('.receiver',row).closest('div').hide();
								$('.receiverspan',row).closest('div').css({'display':'inline-block'});
							}
							else
							{
								$('.label',row).text(new Date(condition.value.dateformat()).format('Y-m-d'));
								$('.receiver',row).val(condition.value);
								$('.receiverhour',row).val(new Date(condition.value.dateformat()).format('H'));
								$('.receiverminute',row).val(new Date(condition.value.dateformat()).format('i'));
								$('.receiver',row).closest('div').css({'display':'inline-block'});
								$('.receiverspan',row).closest('div').hide();
							}
							break;
					}
				};
				this.conditiontable.addrow();
				row=this.conditiontable.rows.last();
				$('.field',row).val(condition.field).trigger('change');
				$('.comp',row).val(condition.comp.code);
				switch (fieldinfo.type)
				{
					case 'CALC':
						switch(fieldinfo.format.toUpperCase())
						{
							case 'NUMBER':
							case 'NUMBER_DIGIT':
								/* initialize value */
								if (condition.value) $('.receiver',row).val(condition.value);
								break;
							case 'DATE':
								/* clear value */
								$('.label',row).text('');
								$('.receiver',row).val('');
								$('.receiverspan',row).closest('div').hide();
								/* initialize value */
								if (condition.value) setupdatevalue(row,condition);
								break;
							case 'DATETIME':
							case 'DAY_HOUR_MINUTE':
								/* clear value */
								$('.label',row).text('');
								$('.receiver',row).val('');
								$('.receiverhour',row).val('00');
								$('.receiverminute',row).val('00');
								$('.receiverspan',row).closest('div').hide();
								/* initialize value */
								if (condition.value) setupdatetimevalue(row,condition);
								break;
							case 'TIME':
							case 'HOUR_MINUTE':
								/* clear value */
								$('.receiver',row).val('');
								$('.receiverhour',row).val('00');
								$('.receiverminute',row).val('00');
								/* initialize value */
								if (condition.value)
								{
									$('.receiver',row).val(condition.value);
									$('.receiverhour',row).val(('0'+condition.value.split(':')[0]).slice(-2));
									$('.receiverminute',row).val(('0'+condition.value.split(':')[1]).slice(-2));
								}
								break;
						}
						break;
					case 'CHECK_BOX':
					case 'DROP_DOWN':
					case 'MULTI_SELECT':
					case 'RADIO_BUTTON':
						/* clear value */
						$.each($('input[type=checkbox]',row),function(){
							$(this).prop('checked',false);
						});
						/* initialize value */
						if (condition.value) for (var i2=0;i2<condition.value.length;i2++) $('#'+condition.value[i2].replace(/[ !"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g,'\\$&'),row).prop('checked',true);
						break;
					case 'CREATED_TIME':
					case 'DATETIME':
					case 'UPDATED_TIME':
						/* clear value */
						$('.label',row).text('');
						$('.receiver',row).val('');
						$('.receiverhour',row).val('00');
						$('.receiverminute',row).val('00');
						$('.receiverspan',row).closest('div').hide();
						/* initialize value */
						if (condition.value) setupdatetimevalue(row,condition);
						break;
					case 'CREATOR':
					case 'GROUP_SELECT':
					case 'MODIFIER':
					case 'ORGANIZATION_SELECT':
					case 'STATUS_ASSIGNEE':
					case 'USER_SELECT':
					case 'STATUS':
						var label=[];
						var receiver=[];
						/* clear value */
						$('.label',row).text('');
						$('.receiver',row).val('');
						/* initialize value */
						if (condition.value)
						{
							$('.label',row).text(condition.label);
							$('.receiver',row).val(condition.value.join(','));
						}
						break;
					case 'DATE':
						/* clear value */
						$('.label',row).text('');
						$('.receiver',row).val('');
						$('.receiverspan',row).closest('div').hide();
						/* initialize value */
						if (condition.value) setupdatevalue(row,condition);
						break;
					case 'TIME':
						/* clear value */
						$('.receiver',row).val('');
						$('.receiverhour',row).val('00');
						$('.receiverminute',row).val('00');
						/* initialize value */
						if (condition.value)
						{
							$('.receiver',row).val(condition.value);
							$('.receiverhour',row).val(('0'+condition.value.split(':')[0]).slice(-2));
							$('.receiverminute',row).val(('0'+condition.value.split(':')[1]).slice(-2));
						}
						break;
					default:
						/* clear value */
						if ($('.label',row).size()) $('.label',row).text('');
						$('.receiver',row).val('');
						/* initialize value */
						if (condition.value)
						{
							if ($('.label',row).size()) $('.label',row).html(condition.label);
							$('.receiver',row).val(condition.value);
						}
						break;
				}
			}
			this.conditiontable.addrow();
			this.dialog.cover.show();
		},
		/* hide form */
		hide:function(){
			this.dialog.cover.hide();
		},
		/* redisplay referer */
		unhide:function(){
			this.dialog.cover.show();
		}
	};
	return new ConditionsForm($.extend(true,{
		app:kintone.app.getId(),
		container:$(this),
		useloginuser:false,
		fields:{}
	},options));
};
jTis.fn.dynamictable=function(options){
	var DynamicTable=function(options){
		/* valiable */
		var my=this;
		/* setup table */
		this.options=$.extend(true,{
			container:null,
			table:null,
			head:null,
			foot:null,
			template:null,
			trace:{
				activeclass:'',
				rangeclass:'',
				callback:null
			},
			guide:{
				activeclass:'',
				rangeclass:''
			},
			fixrow:{
				top:0
			},
			fixcolumn:{
				activeclass:'',
				columns:-1,
				exclude:0
			},
			resizecolumn:{
				activeclass:'',
				limit:15
			},
			addcallback:null,
			delcallback:null
		},options);
		this.template=this.options.template;
		this.container=(function(table,head,body,foot){
			my.head=head;
			my.body=body;
			my.foot=foot;
			table.append(my.head);
			table.append(my.body);
			if (my.foot) table.append(my.foot);
			return table;
		})(this.options.table,$('<thead>').append(this.options.head),$('<tbody>'),(this.options.foot)?$('<tfoot>').append(this.options.foot):null);
		if (this.options.container!=null) this.options.container.append(this.container);
		/* setup fixed row */
		(function(head){
			var height=(my.options.fixrow.top)?my.options.fixrow.top:0;
			$.each(head,function(index){
				$(this).children('th').addClass('dynamictable-rowsticky').css({
					'position':'-webkit-sticky'
				}).css({
					'position':'sticky',
					'top':height.toString()+'px'
				});
				height+=$(this).outerHeight(true);
			});
		})(this.head.children('tr'));
		/* property */
		this.fixcolumn=-1;
		this.stickyindex=1;
		this.lastrow=null;
		this.headrows=this.head.children('tr').length;
		this.cols=(function(head){
			var res=[];
			$.each(head,function(index){
				var rowindex=$(this)[0].rowIndex;
				$.each($(this).children('th'),function(index){
					if (rowindex==0) res.push([$(this)]);
					else res[index].push($(this));
				});
			});
			return res;
		})(this.head.children('tr'));
		this.resizeinfo={
			containers:(function(){
				var res=[my.options.container];
				$.each(my.container.parents(),function(index){
					var check=$(this).attr('style');
					if (check)
						if (check.indexOf(my.container.width().toString()+'px')>-1) res.push($(this));
				});
				return res;
			})(),
			resizing:false
		};
		this.rows=[];
		this.addcallback=this.options.addcallback;
		this.delcallback=this.options.delcallback;
		/* event of trace */
		if (this.options.trace.activeclass)
			this.container.off('mousedown.dynamictable-trace').on('mousedown.dynamictable-trace','.'+this.options.trace.rangeclass,function(e){
				var cellindex=$(this)[0].cellIndex;
				var traceinfo={
					row:$(this).parent(),
					start:cellindex,
					from:cellindex,
					to:cellindex
				};
				/* trace start */
				my.container.off('mouseenter.dynamictable-trace').on('mouseenter.dynamictable-trace','.'+my.options.trace.rangeclass,function(e){
					var cellindex=$(this)[0].cellIndex;
					if (traceinfo.start>cellindex)
					{
						traceinfo.from=cellindex;
						traceinfo.to=traceinfo.start;
					}
					else
					{
						traceinfo.from=traceinfo.start;
						traceinfo.to=cellindex;
					}
					for (var i=0;i<my.cols.length;i++)
					{
						var cell=my.cols[i][traceinfo.row[0].rowIndex];
						if (i>traceinfo.from-1 && i<traceinfo.to+1) cell.addClass(my.options.trace.activeclass);
						else cell.removeClass(my.options.trace.activeclass);
					}
					e.stopPropagation();
				});
				$(window).off('mouseup.dynamictable-trace').on('mouseup.dynamictable-trace',function(e){
					if (my.options.trace.callback) my.options.trace.callback(
						my,
						traceinfo.row,
						traceinfo.from,
						traceinfo.to
					);
					/* trace end */
					my.container.off('mouseenter.dynamictable-trace');
					$(window).off('mouseup.dynamictable-trace');
					$('.'+my.options.trace.activeclass).removeClass(my.options.trace.activeclass);
					e.stopPropagation();
				});
				$(this).addClass(my.options.trace.activeclass);
				e.stopPropagation();
			});
		/* event of guide */
		if (this.options.guide.activeclass)
		{
			this.container
			.on('mouseenter.dynamictable-guide','.'+this.options.guide.rangeclass,function(e){
				var columns=my.cols[$(this)[0].cellIndex];
				for (var i=0;i<columns.length;i++)
					if (columns[i].hasClass(my.options.guide.rangeclass)) columns[i].addClass(my.options.guide.activeclass);
				e.stopPropagation();
			})
			.on('mouseleave.dynamictable-guide','.'+this.options.guide.rangeclass,function(e){
				var columns=my.cols[$(this)[0].cellIndex];
				for (var i=0;i<columns.length;i++)
					if (columns[i].hasClass(my.options.guide.rangeclass)) columns[i].removeClass(my.options.guide.activeclass);
				e.stopPropagation();
			});
		}
		/* event of fixed column */
		if (this.options.fixcolumn.activeclass)
		{
			for (var i=this.options.fixcolumn.exclude;i<this.options.fixcolumn.columns;i++)
				(function(column){
					column[0].on('click.dynamictable-fixcolumn',function(e){
						var width=0;
						if (my.resizeinfo.resizing)
						{
							my.resizeinfo.resizing=false;
							return;
						}
						if (my.fixcolumn!=-1)
						{
							my.cols[my.fixcolumn][0].removeClass(my.options.fixcolumn.activeclass);
							for (var i2=0;i2<my.fixcolumn+1;i2++)
							{
								for (var i3=0;i3<my.cols[i2].length;i3++)
								{
									var cell=my.cols[i2][i3];
									if (i3<my.headrows) cell.removeClass('dynamictable-crosssticky').css({'left':'auto'});
									else
									{
										cell.removeClass('dynamictable-columnsticky').css({
											'left':'auto',
											'position':'relative',
											'z-index':'auto'
										});
									}
								}
								my.template.find('td').eq(i2).removeClass('dynamictable-columnsticky').css({
									'left':'auto',
									'position':'relative',
									'z-index':'auto'
								});
							}
						}
						if (my.fixcolumn!=$(this)[0].cellIndex)
						{
							my.fixcolumn=$(this)[0].cellIndex;
							my.cols[my.fixcolumn][0].addClass(my.options.fixcolumn.activeclass);
							for (var i2=0;i2<my.fixcolumn+1;i2++)
							{
								for (var i3=0;i3<my.cols[i2].length;i3++)
								{
									var cell=my.cols[i2][i3];
									if (i3<my.headrows) cell.addClass('dynamictable-crosssticky').css({'left':width.toString()+'px'});
									else
									{
										cell.addClass('dynamictable-columnsticky').css({
											'left':width.toString()+'px',
											'position':'-webkit-sticky'
										}).css({
											'position':'sticky'
										});
									}
								}
								my.template.find('td').eq(i2).addClass('dynamictable-columnsticky').css({
									'left':width.toString()+'px',
									'position':'-webkit-sticky'
								}).css({
									'position':'sticky'
								});
								if (my.cols[i2][0].is(':visible')) width+=my.cols[i2][0].outerWidth(true);
							}
						}
						else my.fixcolumn=-1;
						my.resetsticky();
					});
				})(this.cols[i]);
		}
		/* event of resize column */
		if (this.options.resizecolumn.activeclass)
		{
			this.head
			.on('mousemove.dynamictable-resizecolumn,touchmove.dynamictable-resizecolumn','th',function(e){
				if (my.resizeinfo.resizing) return;
				var pointer=(e.originalEvent.touches)?e.originalEvent.touches[0]:e;
				var left=pointer.pageX-$(this).offset().left;
				var width=$(this).outerWidth(false);
				if (left<width && left>width-5) $(this).addClass(my.options.resizecolumn.activeclass);
				else $(this).removeClass(my.options.resizecolumn.activeclass);
			})
			.on('mousedown.dynamictable-resizecolumn,touchstart.dynamictable-resizecolumn','th',function(e){
				if ($(this).hasClass(my.options.resizecolumn.activeclass))
				{
					var pointer=(e.originalEvent.touches)?e.originalEvent.touches[0]:e;
					var keep={
						cell:$(this),
						columnwidth:$(this).outerWidth(false),
						containerwidth:my.options.container.outerWidth(false),
						posX:pointer.pageX
					};
					$(window).off('mousemove.dynamictable-resizecolumn,touchmove.dynamictable-resizecolumn').on('mousemove.dynamictable-resizecolumn,touchmove.dynamictable-resizecolumn',function(e){
						var pointer=(e.originalEvent.touches)?e.originalEvent.touches[0]:e;
						var width=keep.columnwidth+pointer.pageX-keep.posX;
						if (width<my.options.resizecolumn.limit) width=my.options.resizecolumn.limit;
						/* resize column */
						keep.cell.css({'min-width':width.toString()+'px','width':width.toString()+'px'});
						/* resize container */
						for (var i=0;i<my.resizeinfo.containers.length;i++)
							my.resizeinfo.containers[i].css({'width':(keep.containerwidth-keep.columnwidth+width).toString()+'px'});
						/* reset fixed position */
						width=0;
						for (var i=0;i<my.fixcolumn+1;i++)
						{
							for (var i2=0;i2<my.cols[i].length;i2++) my.cols[i][i2].css({'left':width.toString()+'px'});
							my.template.find('td').eq(i).css({'left':width.toString()+'px'});
							if (my.cols[i][0].is(':visible')) width+=my.cols[i][0].outerWidth(true);
						}
						e.stopPropagation();
						e.preventDefault();
					});
					$(window).off('mouseup.dynamictable-resizecolumn,touchend.dynamictable-resizecolumn').on('mouseup.dynamictable-resizecolumn,touchend.dynamictable-resizecolumn',function(e){
						if (!my.options.fixcolumn.activeclass) my.resizeinfo.resizing=false;
						else keep.cell.trigger('click.dynamictable-fixcolumn');
						/* resize end */
						$(window).off('mousemove.dynamictable-resizecolumn,touchmove.dynamictable-resizecolumn');
						$(window).off('mouseup.dynamictable-resizecolumn,touchend.dynamictable-resizecolumn');
						if (my.options.resizecolumn.callback) my.options.resizecolumn.callback(keep.cell);
						e.stopPropagation();
						e.preventDefault();
					});
					my.resizeinfo.resizing=true;
					e.stopPropagation();
					e.preventDefault();
				}
			});
		}
	};
	DynamicTable.prototype={
		addrow:function(target,callback){
			var my=this;
			var row=this.template.clone(true);
			if (target==null)
			{
				if (this.lastrow) row.insertAfter(this.lastrow);
				else this.body.append(row);
				this.lastrow=row;
			}
			else
			{
				if (target[0].rowIndex-my.headrows==this.rows.length-1)
				{
					row.insertAfter(this.lastrow);
					this.lastrow=row;
				}
				else row.insertAfter(target);
			}
			this.rows=this.body.children('tr');
			$.each(row.children('td'),function(index){
				my.cols[index].splice(row[0].rowIndex,0,$(this));
			});
			this.resetsticky();
			/* events */
			if (callback!=null) callback(row);
			if (this.addcallback!=null) this.addcallback(row,row[0].rowIndex-my.headrows);
			return row;
		},
		clearrows:function(){
			if (this.rows.length!=0) this.rows.remove();
			this.rows=this.body.children('tr');
			this.lastrow=null;
			for (var i=0;i<this.cols.length;i++) this.cols[i].splice(this.headrows);
			this.resetsticky();
			/* events */
			if (this.delcallback!=null) this.delcallback(-1);
		},
		delrow:function(row){
			var rowindex=row[0].rowIndex;
			row.remove();
			this.rows=this.body.children('tr');
			this.lastrow=(this.rows.length!=0)?this.rows.last():null;
			for (var i=0;i<this.cols.length;i++) this.cols[i].splice(rowindex,1);
			this.resetsticky();
			/* events */
			if (this.delcallback!=null) this.delcallback(rowindex-my.headrows);
		},
		draggableclip:function(clip,activeclass,rangeclass,dragstart,dragend,resizeclass,resized){
			var my=this;
			var resizing=false;
			return clip.attr('draggable',true)
			.on('mousemove.dynamictable-resizeclipcheck',function(e){
				if (resizeclass)
				{
					if (resizing) return;
					var left=e.pageX-clip.offset().left;
					var width=clip.outerWidth(false);
					if (left<width && left>width-5) clip.addClass(resizeclass).attr('draggable',false);
					else clip.removeClass(resizeclass).attr('draggable',true);
				}
			})
			.on('mousedown.dynamictable-resizeclip',function(e){
				/* events of resize */
				if (resizeclass)
					if (clip.hasClass(resizeclass))
					{
						var keep={
							clipmin:cell[0].getBoundingClientRect().width-clip.position().left*2,
							clipwidth:clip.outerWidth(false),
							posX:e.pageX
						};
						my.container.off('mousemove.dynamictable-resizeclip').on('mousemove.dynamictable-resizeclip','.'+rangeclass,function(e){
							var width=keep.clipwidth+e.pageX-keep.posX;
							if (width<keep.clipmin) width=keep.clipmin;
							/* resize clip */
							clip.css({'width':width.toString()+'px'});
							e.stopPropagation();
							e.preventDefault();
						});
						$(window).off('mouseup.dynamictable-resizeclip').on('mouseup.dynamictable-resizeclip',function(e){
							var rowindex=clip.closest('tr')[0].rowIndex;
							var rect=clip[0].getBoundingClientRect();
							var cell=(function(elements){
								var res=null;
								if (elements)
									for (var i=0;i<elements.length;i++) if (elements[i].tagName=='TD') {res=elements[i];break;}
								return res;
							})(document.elementsFromPoint(e.clientX,e.clientY));
							resizing=false;
							if (cell)
								if (resized) resized(cell.cellIndex);
							/* resize end */
							my.container.off('mousemove.dynamictable-resizeclip');
							$(window).off('mouseup.dynamictable-resizeclip');
							e.stopPropagation();
							e.preventDefault();
						});
						resizing=true;
						e.stopPropagation();
						e.preventDefault();
					}
			})
			.on('mousedown',function(e){
				/* avoid trace */
				e.stopPropagation();
			})
			.on('dragstart.dynamictable-dragdrop',function(e){
				var dragevent=(e.originalEvent)?e.originalEvent:e;
				var offsetX=dragevent.offsetX;
				var keep={
					cellindex:-1,
					row:clip.closest('tr')
				};
				if (dragstart) dragstart(dragevent);
				if ('cancel' in dragevent)
					if (dragevent.cancel) return;
				/* events of drag&drop */
				my.rows.attr('draggable',true)
				.off('dragover.dynamictable-dragdrop').on('dragover.dynamictable-dragdrop',function(e){
					var dragevent=(e.originalEvent)?e.originalEvent:e;
					var cell=(function(elements){
						var res=null;
						if (elements)
							for (var i=0;i<elements.length;i++) if (elements[i].tagName=='TD') {res=elements[i];break;}
						return res;
					})(document.elementsFromPoint(dragevent.clientX-offsetX,dragevent.clientY));
					$(this).addClass(activeclass);
					if (cell)
					{
						if (keep.cellindex!=-1 && keep.cellindex!=cell.cellIndex)
						{
							(function(columns){
								for (var i=0;i<columns.length;i++)
									if (columns[i].hasClass(my.options.guide.rangeclass)) columns[i].removeClass(my.options.guide.activeclass);
							})(my.cols[keep.cellindex]);
						}
						(function(columns){
							for (var i=0;i<columns.length;i++)
								if (columns[i].hasClass(my.options.guide.rangeclass)) columns[i].addClass(my.options.guide.activeclass);
						})(my.cols[cell.cellIndex]);
						keep.cellindex=cell.cellIndex;
					}
					e.stopPropagation();
					e.preventDefault();
				})
				.off('dragleave.dynamictable-dragdrop').on('dragleave.dynamictable-dragdrop',function(e){
					$(this).removeClass(activeclass);
					e.stopPropagation();
					e.preventDefault();
				})
				.off('drop.dynamictable-dragdrop').on('drop.dynamictable-dragdrop',function(e){
					var dragevent=(e.originalEvent)?e.originalEvent:e;
					var cell=(function(elements){
						var res=null;
						if (elements)
							for (var i=0;i<elements.length;i++) if (elements[i].tagName=='TD') {res=elements[i];break;}
						return res;
					})(document.elementsFromPoint(dragevent.clientX-offsetX,dragevent.clientY));
					if (cell)
						if ($(cell).hasClass(rangeclass))
							if (dragend) dragend(dragevent,keep.row,$(this),cell.cellIndex);
					/* drag&drop end */
					my.rows.attr('draggable',false).off('dragover.dynamictable-dragdrop').off('dragleave.dynamictable-dragdrop');
					$(this).removeClass(activeclass);
					if (my.options.guide.rangeclass) $('.'+my.options.guide.rangeclass).removeClass(my.options.guide.activeclass);
					e.stopPropagation();
					e.preventDefault();
				});
			});
		},
		mergerow:function(columns,keyvalue){
			var my=this;
			var mergeinfos=[];
			for (var i=0;i<columns;i++) mergeinfos.push({cache:'',index:-1,span:0});
			$.each(this.rows,function(index){
				var row=$(this);
				for (var i=0;i<columns;i++)
				{
					var key=keyvalue(row.find('td').eq(i));
					if (mergeinfos[i].cache!=key)
					{
						if (mergeinfos[i].index!=-1)
						{
							my.rows.eq(mergeinfos[i].index).find('td').eq(i).attr('rowspan',mergeinfos[i].span);
							for (var i2=mergeinfos[i].index+1;i2<index;i2++) my.rows.eq(i2).find('td').eq(i).hide();
						}
						mergeinfos[i].cache=key;
						mergeinfos[i].index=index;
						mergeinfos[i].span=0;
						for (var i2=i+1;i2<columns;i2++)
						{
							key=keyvalue(row.find('td').eq(i2));
							if (mergeinfos[i2].index!=-1)
							{
								my.rows.eq(mergeinfos[i2].index).find('td').eq(i2).attr('rowspan',mergeinfos[i2].span);
								for (var i3=mergeinfos[i2].index+1;i3<index;i3++) my.rows.eq(i3).find('td').eq(i2).hide();
							}
							mergeinfos[i2].cache=key;
							mergeinfos[i2].index=index;
							mergeinfos[i2].span=0;
						}
					}
					mergeinfos[i].span++;
				}
			});
			var index=this.rows.length-1;
			var row=this.rows.last();
			for (var i=0;i<columns;i++)
			{
				var key=keyvalue(row.find('td').eq(i));
				if (mergeinfos[i].cache==key && mergeinfos[i].index!=index)
				{
					this.rows.eq(mergeinfos[i].index).find('td').eq(i).attr('rowspan',mergeinfos[i].span);
					for (var i2=mergeinfos[i].index+1;i2<index+1;i2++) this.rows.eq(i2).find('td').eq(i).hide();
				}
			}
		},
		resetsticky:function(){
			var my=this;
			this.stickyindex=this.container.find('*').length+1;
			$('.dynamictable-columnsticky',this.container).css({'z-index':this.stickyindex.toString()});
			this.stickyindex++;
			$('.dynamictable-rowsticky',this.container).css({'z-index':this.stickyindex.toString()});
			this.stickyindex++
			$('.dynamictable-crosssticky',this.container).css({'z-index':this.stickyindex.toString()});
			/* adjust z-index of list selectmenu */
			if ($('.dynamictable-style').size()) $('.dynamictable-style').remove();
			$('body').append($('<style class="dynamictable-style" type="text/css">').text((function(){
				var res='';
				res+='[class*=-dialog]{z-index:'+(my.stickyindex+1).toString()+' !important;}';
				res+='[class*=-menu]{z-index:'+(my.stickyindex+1).toString()+' !important;}';
				res+='[class*=-pulldown]{z-index:'+(my.stickyindex+1).toString()+' !important;}';
				res+='[class*=-selectmenu]{z-index:'+(my.stickyindex+1).toString()+' !important;}';
				res+='[class*=-sidemenu]{z-index:'+(my.stickyindex+1).toString()+' !important;}';
				res+='[class*=-fieldselect-combobox-menu]{z-index:'+(my.stickyindex+2).toString()+' !important;}';
				return res;
			})()));
		}
	};
	return new DynamicTable($.extend(true,{
		container:null,
		table:$(this),
		head:null,
		foot:null,
		template:null,
		trace:{
			activeclass:'',
			rangeclass:'',
			callback:null
		},
		guide:{
			activeclass:'',
			rangeclass:''
		},
		fixrow:{
			top:0
		},
		fixcolumn:{
			activeclass:'',
			columns:-1,
			exclude:0
		},
		resizecolumn:{
			activeclass:'',
			limit:15
		},
		addcallback:null,
		delcallback:null
	},options));
};
jTis.fn.actionbuttons=function(ismobile){
	if (ismobile)
	{
		return {
			ok:$('.gaia-mobile-v2-viewpanel-footer .gaia-mobile-v2-app-record-edittoolbar-save'),
			cancel:$('.gaia-mobile-v2-viewpanel-footer .gaia-mobile-v2-app-record-edittoolbar-cancel')
		};
	}
	else
	{
		return {
			ok:$('.gaia-argoui-app-edit-buttons .gaia-ui-actionmenu-save'),
			cancel:$('.gaia-argoui-app-edit-buttons .gaia-ui-actionmenu-cancel')
		};
	}
}
jTis.fn.fields=function(fieldcode,isgroup){
	var fields=[];
	var target=$(this);
	$.each(cybozu.data.page.FORM_DATA.schema.table.fieldList,function(key,values){
		if (values.var==fieldcode)
		{
			if (isgroup)
			{
				$.each(target.find('[class*='+key+']'),function(index){
					if ($(this).prop('tagName').toLowerCase()!='undefined')
						if ($.inArray($(this),fields)==-1) fields.push($(this));
				});
			}
			else
			{
				var elements=target.find('[id*='+key+'],[name*='+key+']');
				if (elements.length==0) elements=target.find('.field-'+key+' input')
				$.each(elements,function(index){
					if ($(this).prop('tagName').toLowerCase()!='undefined')
						if ($.inArray($(this),fields)==-1) fields.push($(this));
				});
			}
		}
	});
	if ('subTable' in cybozu.data.page.FORM_DATA.schema)
		$.each(cybozu.data.page.FORM_DATA.schema.subTable,function(key,values){
			$.each(values.fieldList,function(key,values){
				if (values.var==fieldcode)
				{
					var elements=target.find('[id*='+key+'],[name*='+key+']');
					if (elements.length==0) elements=target.find('.field-'+key+' input')
					$.each(elements,function(index){
						if ($(this).prop('tagName').toLowerCase()!='undefined')
							if ($.inArray($(this),fields)==-1) fields.push($(this));
					});
				}
			});
		});
	return fields;
}
jTis.fn.fielderrors=function(){
	var res=[];
	$.each($('.input-error-cybozu,.control-errors-gaia'),function(index){
		if ($(this).text()) res.push($(this).closest('.control-gaia'));
	});
	return res;
}
jTis.fn.fieldkeys=function(){
	var res={};
	$.each(cybozu.data.page.FORM_DATA.schema.table.fieldList,function(key,values){
		res[values.var]=key;
	});
	if ('subTable' in cybozu.data.page.FORM_DATA.schema)
		$.each(cybozu.data.page.FORM_DATA.schema.subTable,function(key,values){
			$.each(values.fieldList,function(key,values){
				res[values.var]=key;
			});
		});
	return res;
}
jTis.fn.fieldoptionkeys=function(){
	var res={};
	$.each(cybozu.data.page.FORM_DATA.schema.table.fieldList,function(key,values){
		if ('properties' in values)
			if ('options' in values.properties)
				if ($.isArray(values.properties.options))
				{
					res[values.var]={};
					for (var i=0;i<values.properties.options.length;i++)
					{
						var option=values.properties.options[i];
						if (option.valid) res[values.var][option.label]=option.id;
					}
				}
	});
	if ('subTable' in cybozu.data.page.FORM_DATA.schema)
		$.each(cybozu.data.page.FORM_DATA.schema.subTable,function(key,values){
			$.each(values.fieldList,function(key,values){
				if ('properties' in values)
					if ('options' in values.properties)
						if ($.isArray(values.properties.options))
						{
							res[values.var]={};
							for (var i=0;i<values.properties.options.length;i++)
							{
								var option=values.properties.options[i];
								if (option.valid) res[values.var][option.label]=option.id;
							}
						}
			});
		});
	return res;
}
jTis.fn.fieldstatuskeys=function(){
	var res={};
	for (var i=0;i<cybozu.data.page.STATUS_DATA.states.length;i++)
		res[cybozu.data.page.STATUS_DATA.states[i].label]=cybozu.data.page.STATUS_DATA.states[i].id;
	return res;
}
jTis.fn.fieldcontainer=function(field,type){
	var res;
	switch (type)
	{
		case 'CALC':
			res=field.closest('.control-calc-field-gaia');
			break;
		case 'CHECK_BOX':
			res=field.closest('.control-multiple_check-field-gaia');
			break;
		case 'CREATED_TIME':
			res=field.closest('.control-created_at-field-gaia');
			break;
		case 'CREATOR':
			res=field.closest('.control-creator-field-gaia');
			break;
		case 'DATE':
			res=field.closest('.control-date-field-gaia');
			break;
		case 'DATETIME':
			res=field.closest('.control-datetime-field-gaia');
			break;
		case 'DROP_DOWN':
			res=field.closest('.control-single_select-field-gaia');
			break;
		case 'FILE':
			res=field.closest('.control-file-field-gaia');
			break;
		case 'GROUP_SELECT':
			res=field.closest('.control-group_select-field-gaia');
			break;
		case 'HR':
			res=field.closest('.control-hr-field-gaia');
			break;
		case 'LABEL':
			res=field.closest('.control-label-field-gaia');
			break;
		case 'LINK':
			res=field.closest('.control-link-field-gaia');
			break;
		case 'MODIFIER':
			res=field.closest('.control-modifier-field-gaia');
			break;
		case 'MULTI_LINE_TEXT':
			res=field.closest('.control-multiple_line_text-field-gaia');
			break;
		case 'MULTI_SELECT':
			res=field.closest('.control-multiple_select-field-gaia');
			break;
		case 'NUMBER':
			res=field.closest('.control-decimal-field-gaia');
			break;
		case 'ORGANIZATION_SELECT':
			res=field.closest('.control-organization_select-field-gaia');
			break;
		case 'RADIO_BUTTON':
			res=field.closest('.control-single_check-field-gaia');
			break;
		case 'RECORD_NUMBER':
			res=field.closest('.control-record_id-field-gaia');
			break;
		case 'REFERENCE_TABLE':
			res=field.closest('.control-reference_table-field-gaia');
			break;
		case 'RICH_TEXT':
			res=field.closest('.control-editor-field-gaia');
			break;
		case 'SINGLE_LINE_TEXT':
			res=field.closest('.control-single_line_text-field-gaia');
			break;
		case 'SPACER':
			res=field.closest('.control-spacer-field-gaia');
			break;
		case 'TIME':
			res=field.closest('.control-time-field-gaia');
			break;
		case 'UPDATED_TIME':
			res=field.closest('.control-modified_at-field-gaia');
			break;
		case 'USER_SELECT':
			res=field.closest('.control-user_select-field-gaia');
	}
	return res;
}
jTis.fn.fieldsform=function(options){
	var FieldsForm=function(options){
		var options=$.extend(true,{
			container:null,
			fields:[],
			callback:{
				group:null,
				organization:null,
				user:null
			},
			radionulllabel:''
		},options);
		/* valiable */
		var my=this;
		/* property */
		this.fields=options.fields;
		this.callback=options.callback;
		this.radionulllabel=options.radionulllabel;
		this.dialog=createdialog('standard',0,600);
		this.contents=this.dialog.contents;
		this.groupsource=null;
		this.organizationsource=null;
		this.usersource=null;
		this.blobs={};
		this.referer={};
		/* append elements */
		this.fieldcontainer=div.clone(true).addClass('container').css({'padding':'5px','width':'100%'}).append(title.clone(true));
		for (var i=0;i<this.fields.length;i++)
		{
			(function(fieldinfo){
				var fieldcontainer=my.fieldcontainer.clone(true).attr('id',fieldinfo.code);
				var fieldoptions=[];
				var receiver=null;
				fieldcontainer.find('.title').text(fieldinfo.label);
				switch (fieldinfo.type)
				{
					case 'CHECK_BOX':
					case 'MULTI_SELECT':
						fieldoptions=[fieldinfo.options.length];
						$.each(fieldinfo.options,function(key,values){
							fieldoptions[values.index]=values.label;
						});
						for (var i2=0;i2<fieldoptions.length;i2++)
						{
							receiver=checkbox.clone(true);
							$('.label',receiver).html(fieldoptions[i2]);
							$('.receiver',receiver).attr('id',fieldoptions[i2]).val(fieldoptions[i2]);
							fieldcontainer.append(receiver);
						}
						break;
					case 'DATE':
						receiver=referer.clone(true);
						$('.search',receiver).on('click',function(){
							var target=$(this);
							/* day pickup */
							var calendar=$('body').calendar({
								selected:function(cell,value){
									target.closest('.container').find('.label').text(value);
									target.closest('.container').find('.receiver').val(value);
								}
							});
							calendar.show({activedate:new Date(target.closest('.container').find('.label').text().dateformat())});
						});
						$('.clear',receiver).on('click',function(){
							var target=$(this);
							target.closest('.container').find('.label').text('');
							target.closest('.container').find('.receiver').val('');
						});
						fieldcontainer.append(receiver);
						break;
					case 'DATETIME':
						receiver=referer.clone(true).append(time.clone(true));
						$('.label',receiver).css({'width':'calc(100% - 150px)'});
						$('.search',receiver).on('click',function(){
							var target=$(this);
							/* day pickup */
							var calendar=$('body').calendar({
								selected:function(cell,value){
									target.closest('.container').find('.label').text(value);
									target.closest('.container').find('.receiver').val(my.datetimevalue(target.closest('.container')));
								}
							});
							calendar.show({activedate:new Date(target.closest('.container').find('.label').text().dateformat())});
						});
						$('.clear',receiver).on('click',function(){
							var target=$(this);
							target.closest('.container').find('.label').text('');
							target.closest('.container').find('.receiver').val('');
						});
						$('.receiverhour',receiver).on('change',function(){
							$(this).closest('.container').find('.receiver').val(my.datetimevalue($(this).closest('.container')));
						});
						$('.receiverminute',receiver).on('change',function(){
							$(this).closest('.container').find('.receiver').val(my.datetimevalue($(this).closest('.container')));
						});
						fieldcontainer.append(receiver);
						break;
					case 'DROP_DOWN':
						receiver=select.clone(true).addClass('receiver').css({'display':'block','width':'100%'});
						receiver.append($('<option>').attr('value','').text(''));
						fieldoptions=[fieldinfo.options.length];
						$.each(fieldinfo.options,function(key,values){
							fieldoptions[values.index]=values.label;
						});
						for (var i2=0;i2<fieldoptions.length;i2++) receiver.append($('<option>').attr('value',fieldoptions[i2]).html(fieldoptions[i2]));
						fieldcontainer.append(receiver);
						break;
					case 'FILE':
						my.blobs[fieldinfo.code]={};
						receiver=referer.clone(true);
						$('.search',receiver).on('click',function(){
							var target=$(this);
							my.filebox.show({
								datasource:((target.closest('.container').find('.receiver').val().length!=0)?JSON.parse(target.closest('.container').find('.receiver').val()):[]),
								buttons:{
									ok:function(resp){
										var files=my.filevalue(resp);
										target.closest('.container').find('.label').text(files.names);
										target.closest('.container').find('.receiver').val(files.values);
										my.blobs[fieldinfo.code]=files.blobs;
										/* close the filebox */
										my.filebox.hide();
									},
									cancel:function(){
										/* close the filebox */
										my.filebox.hide();
									}
								},
								files:(function(files){
									var res={};
									for (var i=0;i<files.length;i++)
									{
										if ('uploadtime' in files[i])
											if (files[i].uploadtime in my.blobs[fieldinfo.code])
												res[files[i].uploadtime]=my.blobs[fieldinfo.code][files[i].uploadtime];
									}
									return res;
								})(JSON.parse(target.closest('.container').find('.receiver').val()))
							});
						});
						$('.clear',receiver).on('click',function(){
							var target=$(this);
							target.closest('.container').find('.label').text('');
							target.closest('.container').find('.receiver').val('');
						});
						fieldcontainer.append(receiver);
						break;
					case 'GROUP_SELECT':
						/* load group datas */
						if (my.groupsource==null)
						{
							my.groupsource=[];
							$.loadgroups(function(records){
								records.sort(function(a,b){
									if(parseInt(a.id)<parseInt(b.id)) return -1;
									if(parseInt(a.id)>parseInt(b.id)) return 1;
									return 0;
								});
								$.each(records,function(index,values){
									my.groupsource.push({value:values.code,text:values.name});
								});
								if (my.callback.group) my.callback.group();
							});
						}
						receiver=referer.clone(true);
						$('.search',receiver).on('click',function(){
							var target=$(this);
							my.selectbox.show({
								datasource:my.groupsource,
								buttons:{
									ok:function(selection){
										target.closest('.container').find('.label').text(Object.values(selection).join(','));
										target.closest('.container').find('.receiver').val(Object.keys(selection).join(','));
										/* close the selectbox */
										my.selectbox.hide();
									},
									cancel:function(){
										/* close the selectbox */
										my.selectbox.hide();
									}
								},
								selected:target.closest('.container').find('.receiver').val().split(',')
							});
						});
						$('.clear',receiver).on('click',function(){
							var target=$(this);
							target.closest('.container').find('.label').text('');
							target.closest('.container').find('.receiver').val('');
						});
						fieldcontainer.append(receiver);
						break;
					case 'LINK':
					case 'SINGLE_LINE_TEXT':
						if (fieldinfo.lookup)
						{
							receiver=referer.clone(true);
							$('.key',receiver).val(fieldinfo.lookup.relatedKeyField);
							if (fieldinfo.lookup.lookupPickerFields.length!=0) $('.picker',receiver).val(fieldinfo.lookup.lookupPickerFields.join(','));
							else $('.picker',receiver).val(fieldinfo.lookup.relatedKeyField);
							$('.search',receiver).on('click',function(){
								var target=$(this);
								my.referer[target.closest('.container').attr('id')].show({
									buttons:{
										cancel:function(){
											/* close the reference box */
											my.referer[target.closest('.container').attr('id')].hide();
										}
									},
									callback:function(row){
										var labels=[];
										var pickers=target.closest('.container').find('.picker').val().split(',');
										for (var i2=0;i2<pickers.length;i2++) labels.push(row.find('#'+pickers[i2]).val());
										target.closest('.container').find('.label').html(labels.join('/'));
										target.closest('.container').find('.receiver').val(row.find('#'+target.closest('.container').find('.key').val()).val());
										/* close the reference box */
										my.referer[target.closest('.container').attr('id')].hide();
									}
								});
							});
							$('.clear',receiver).on('click',function(){
								var target=$(this);
								target.closest('.container').find('.label').text('');
								target.closest('.container').find('.receiver').val('');
							});
							/* create reference box */
							(function(fieldinfo){
								kintone.api(kintone.api.url('/k/v1/app/form/fields',true),'GET',{app:fieldinfo.lookup.relatedApp.app},function(resp){
									my.referer[fieldinfo.code]=$('body').referer({
										displaytext:((fieldinfo.lookup.lookupPickerFields.length!=0)?fieldinfo.lookup.lookupPickerFields:[fieldinfo.lookup.relatedKeyField]),
										searches:[
											{
												id:'multi',
												label:'',
												type:'multi'
											}
										],
										searchinfo:{
											app:fieldinfo.lookup.relatedApp.app,
											query:fieldinfo.lookup.filterCond,
											sort:fieldinfo.lookup.sort,
											fieldinfos:$.fieldparallelize(resp.properties)
										}
									});
									my.referer[fieldinfo.code].dialog.cover.css({'z-index':'1000000'});
								},function(error){});
							})(fieldinfo);
						}
						else receiver=textline.clone(true).addClass('receiver');
						fieldcontainer.append(receiver);
						break;
					case 'MULTI_LINE_TEXT':
					case 'RICH_TEXT':
						receiver=textarea.clone(true).addClass('receiver');
						fieldcontainer.append(receiver);
						break;
					case 'NUMBER':
						if (fieldinfo.lookup)
						{
							receiver=referer.clone(true);
							$('.key',receiver).val(fieldinfo.lookup.relatedKeyField);
							if (fieldinfo.lookup.lookupPickerFields.length!=0) $('.picker',receiver).val(fieldinfo.lookup.lookupPickerFields.join(','));
							else $('.picker',receiver).val(fieldinfo.lookup.relatedKeyField);
							$('.search',receiver).on('click',function(){
								var target=$(this);
								my.referer[target.closest('.container').attr('id')].show({
									buttons:{
										cancel:function(){
											/* close the reference box */
											my.referer[target.closest('.container').attr('id')].hide();
										}
									},
									callback:function(row){
										var labels=[];
										var pickers=target.closest('.container').find('.picker').val().split(',');
										for (var i2=0;i2<pickers.length;i2++) labels.push(row.find('#'+pickers[i2]).val());
										target.closest('.container').find('.label').html(labels.join('/'));
										target.closest('.container').find('.receiver').val(row.find('#'+target.closest('.container').find('.key').val()).val());
										/* close the reference box */
										my.referer[target.closest('.container').attr('id')].hide();
									}
								});
							});
							$('.clear',receiver).on('click',function(){
								var target=$(this);
								target.closest('.container').find('.label').text('');
								target.closest('.container').find('.receiver').val('');
							});
							/* create reference box */
							(function(fieldinfo){
								kintone.api(kintone.api.url('/k/v1/app/form/fields',true),'GET',{app:fieldinfo.lookup.relatedApp.app},function(resp){
									my.referer[fieldinfo.code]=$('body').referer({
										displaytext:((fieldinfo.lookup.lookupPickerFields.length!=0)?fieldinfo.lookup.lookupPickerFields:[fieldinfo.lookup.relatedKeyField]),
										searches:[
											{
												id:'multi',
												label:'',
												type:'multi'
											}
										],
										searchinfo:{
											app:fieldinfo.lookup.relatedApp.app,
											query:fieldinfo.lookup.filterCond,
											sort:fieldinfo.lookup.sort,
											fieldinfos:$.fieldparallelize(resp.properties)
										}
									});
									my.referer[fieldinfo.code].dialog.cover.css({'z-index':'1000000'});
								},function(error){});
							})(fieldinfo);
						}
						else
						{
							receiver=textline.clone(true).addClass('receiver');
							receiver.css({'text-align':'right'});
						}
						fieldcontainer.append(receiver);
						break;
					case 'ORGANIZATION_SELECT':
						/* load organization datas */
						if (my.organizationsource==null)
						{
							my.organizationsource=[];
							$.loadorganizations(function(records){
								records.sort(function(a,b){
									if(parseInt(a.id)<parseInt(b.id)) return -1;
									if(parseInt(a.id)>parseInt(b.id)) return 1;
									return 0;
								});
								$.each(records,function(index,values){
									my.organizationsource.push({value:values.code,text:values.name});
								});
								if (my.callback.organization) my.callback.organization();
							});
						}
						receiver=referer.clone(true);
						$('.search',receiver).on('click',function(){
							var target=$(this);
							my.selectbox.show({
								datasource:my.organizationsource,
								buttons:{
									ok:function(selection){
										target.closest('.container').find('.label').text(Object.values(selection).join(','));
										target.closest('.container').find('.receiver').val(Object.keys(selection).join(','));
										/* close the selectbox */
										my.selectbox.hide();
									},
									cancel:function(){
										/* close the selectbox */
										my.selectbox.hide();
									}
								},
								selected:target.closest('.container').find('.receiver').val().split(',')
							});
						});
						$('.clear',receiver).on('click',function(){
							var target=$(this);
							target.closest('.container').find('.label').text('');
							target.closest('.container').find('.receiver').val('');
						});
						fieldcontainer.append(receiver);
						break;
					case 'RADIO_BUTTON':
						var checked=true;
						fieldoptions=[fieldinfo.options.length];
						$.each(fieldinfo.options,function(key,values){
							fieldoptions[values.index]=values.label;
						});
						if (my.radionulllabel.length!=0)
						{
							receiver=radio.clone(true);
							$('.label',receiver).html(my.radionulllabel);
							$('.receiver',receiver).attr('id',my.radionulllabel).attr('name',fieldinfo.code).val('').prop('checked',checked);
							fieldcontainer.append(receiver);
							checked=false;
						}
						for (var i2=0;i2<fieldoptions.length;i2++)
						{
							receiver=radio.clone(true);
							$('.label',receiver).html(fieldoptions[i2]);
							$('.receiver',receiver).attr('id',fieldoptions[i2]).attr('name',fieldinfo.code).val(fieldoptions[i2]).prop('checked',checked);
							fieldcontainer.append(receiver);
							checked=false;
						}
						break;
					case 'TIME':
						receiver=time.clone(true);
						receiver.append($('<input type="hidden" class="receiver">').val('00:00'))
						$('.receiverhour',receiver).on('change',function(){
							$(this).closest('.container').find('.receiver').val(my.timevalue($(this).closest('.container')));
						});
						$('.receiverminute',receiver).on('change',function(){
							$(this).closest('.container').find('.receiver').val(my.timevalue($(this).closest('.container')));
						});
						fieldcontainer.append(receiver);
						break;
					case 'USER_SELECT':
						/* load user datas */
						if (my.usersource==null)
						{
							my.usersource=[];
							$.loadusers(function(records){
								records.sort(function(a,b){
									if(parseInt(a.id)<parseInt(b.id)) return -1;
									if(parseInt(a.id)>parseInt(b.id)) return 1;
									return 0;
								});
								$.each(records,function(index,values){
									my.usersource.push({value:values.code,text:values.name});
								});
								if (my.callback.user) my.callback.user();
							});
						}
						receiver=referer.clone(true);
						$('.search',receiver).on('click',function(){
							var target=$(this);
							my.selectbox.show({
								datasource:my.usersource,
								buttons:{
									ok:function(selection){
										target.closest('.container').find('.label').text(Object.values(selection).join(','));
										target.closest('.container').find('.receiver').val(Object.keys(selection).join(','));
										/* close the selectbox */
										my.selectbox.hide();
									},
									cancel:function(){
										/* close the selectbox */
										my.selectbox.hide();
									}
								},
								selected:target.closest('.container').find('.receiver').val().split(',')
							});
						});
						$('.clear',receiver).on('click',function(){
							var target=$(this);
							target.closest('.container').find('.label').text('');
							target.closest('.container').find('.receiver').val('');
						});
						fieldcontainer.append(receiver);
						break;
				}
				my.dialog.contents.append(fieldcontainer);
			})(this.fields[i]);
		}
		this.dialog.container.append(this.dialog.contents);
		this.dialog.container.append(
			this.dialog.footer
			.append(button.clone(true).attr('id','ok').text('OK'))
			.append(button.clone(true).attr('id','cancel').text('Cancel'))
		);
		this.dialog.cover.append(this.dialog.container);
		options.container.append(this.dialog.cover);
		/* adjust container height */
		$(window).on('load resize',function(){
			my.dialog.container.css({'height':(my.dialog.contents[0].scrollHeight+45).toString()+'px'});
		});
		/* create filebox */
		this.filebox=$('body').fileselect();
		/* create selectbox */
		this.selectbox=$('body').multiselect();
	};
	FieldsForm.prototype={
		/* create datetime value */
		datetimevalue:function(container){
			var date=container.find('.label').text();
			var receiverhour=container.find('.receiverhour');
			var receiverminute=container.find('.receiverminute');
			if (date.length==0) return '';
			else return date+'T'+receiverhour.val()+':'+receiverminute.val()+':00'+$.timezome();
		},
		/* create field value */
		fieldvalue:function(fieldinfo,filedetail){
			var my=this;
			var contents=$('#'+fieldinfo.code,this.contents);
			var receivevalue=contents.find('.receiver').val();
			var receivevalues=[];
			var res={type:fieldinfo.type,value:null};
			switch (fieldinfo.type)
			{
				case 'CHECK_BOX':
				case 'MULTI_SELECT':
					$.each(contents.find('.receiver:checked'),function(){receivevalues.push($(this).val());});
					res.value=receivevalues;
					break;
				case 'FILE':
					var files=JSON.parse(receivevalue);
					for (var i=0;i<files.length;i++)
					{
						if (filedetail)
						{
							receivevalues.push({
								contentType:files[i].contentType,
								fileKey:files[i].fileKey,
								name:files[i].name,
								blob:(files[i].uploadtime in my.blobs[fieldinfo.code])?my.blobs[fieldinfo.code][files[i].uploadtime]:null
							});
						}
						else
						{
							receivevalues.push({fileKey:files[i].fileKey});
						}
					}
					res.value=receivevalues;
					break;
				case 'GROUP_SELECT':
				case 'ORGANIZATION_SELECT':
				case 'USER_SELECT':
					var values=receivevalue.split(',');
					for (var i=0;i<values.length;i++)
						if (values[i]) receivevalues.push({code:values[i]});
					res.value=receivevalues;
					break;
				case 'RADIO_BUTTON':
					receivevalue=contents.find('[name='+fieldinfo.code+']:checked').val();
					res.value=receivevalue;
					break;
				default:
					res.value=receivevalue;
					break;
			}
			return res;
		},
		/* create file values */
		filevalue:function(files){
			var names='';
			var blobs={};
			var values=[];
			if (files)
				$.each(files,function(index){
					names+=files[index].name+',';
					blobs[files[index].uploadtime]=files[index].blob;
					values.push({
						contentType:files[index].contentType,
						fileKey:files[index].fileKey,
						name:files[index].name,
						uploadtime:files[index].uploadtime
					});
				});
			names=names.replace(/,$/g,'');
			return {names:names,blobs:blobs,values:JSON.stringify(values)};
		},
		/* create time value */
		timevalue:function(container){
			var receiverhour=container.find('.receiverhour');
			var receiverminute=container.find('.receiverminute');
			return receiverhour.val()+':'+receiverminute.val();
		},
		/* display form */
		show:function(options){
			var options=$.extend(true,{
				buttons:{},
				values:{}
			},options);
			var my=this;
			/* buttons callback */
			$.each(options.buttons,function(key,values){
				if (my.dialog.footer.find('button#'+key).size())
					my.dialog.footer.find('button#'+key).off('click').on('click',function(){if (values!=null) values();});
			});
			$.each(options.values,function(key,values){
				if (key.match(/^\$/g)) return true;
				if (!$('#'+key,my.dialog.contents).size()) return true;
				var fieldinfo=$.grep(my.fields,function(item,index){return item.code==key;});
				my.showfield($('#'+key,my.dialog.contents),(fieldinfo.length!=0)?fieldinfo[0]:null,values);
			});
			this.dialog.cover.show();
			/* adjust container height */
			this.dialog.container.css({'height':(this.dialog.contents[0].scrollHeight+45).toString()+'px'});
		},
		showfield:function(container,fieldinfo,field){
			var my=this;
			switch (field.type)
			{
				case 'CHECK_BOX':
				case 'MULTI_SELECT':
					/* clear value */
					$.each($('input[type=checkbox]',container),function(){
						$(this).prop('checked',false);
					});
					/* initialize value */
					for (var i=0;i<field.value.length;i++) $('#'+field.value[i].replace(/[ !"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g,'\\$&'),container).prop('checked',true);
					break;
				case 'DATE':
					/* clear value */
					$('.label',container).text('');
					$('.receiver',container).val('');
					if (!field.value) return true;
					/* initialize value */
					$('.label',container).text(field.value);
					$('.receiver',container).val(field.value);
					break;
				case 'DATETIME':
					/* clear value */
					$('.label',container).text('');
					$('.receiver',container).val('');
					$('.receiverhour',container).val('00');
					$('.receiverminute',container).val('00');
					if (!field.value) return true;
					/* initialize value */
					$('.label',container).text(new Date(field.value.dateformat()).format('Y-m-d'));
					$('.receiver',container).val(field.value);
					$('.receiverhour',container).val(new Date(field.value.dateformat()).format('H'));
					$('.receiverminute',container).val(new Date(field.value.dateformat()).format('i'));
					break;
				case 'FILE':
					var files=my.filevalue(field.value);
					/* clear value */
					$('.label',container).text('');
					$('.receiver',container).val('');
					/* initialize value */
					$('.label',container).text(files.names);
					$('.receiver',container).val(files.values);
					break;
				case 'GROUP_SELECT':
				case 'ORGANIZATION_SELECT':
				case 'USER_SELECT':
					var label=[];
					var receiver=[];
					/* clear value */
					$('.label',container).text('');
					$('.receiver',container).val('');
					/* initialize value */
					$.each(field.value,function(index){
						label.push(field.value[index].name);
						receiver.push(field.value[index].code);
					});
					$('.label',container).text(label.join(','));
					$('.receiver',container).val(receiver.join(','));
					break;
				case 'RADIO_BUTTON':
					if (field.value)
						$('#'+field.value.replace(/[ !"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g,'\\$&'),container).prop('checked',true);
					break;
				case 'TIME':
					/* clear value */
					$('.receiver',container).val('');
					$('.receiverhour',container).val('00');
					$('.receiverminute',container).val('00');
					if (!field.value) return true;
					/* initialize value */
					$('.receiver',container).val(field.value);
					$('.receiverhour',container).val(('0'+field.value.split(':')[0]).slice(-2));
					$('.receiverminute',container).val(('0'+field.value.split(':')[1]).slice(-2));
					break;
				default:
					/* clear value */
					$('.receiver',container).val('');
					/* initialize value */
					if (fieldinfo)
					{
						if (fieldinfo.lookup && field.value)
						{
							var body={
								app:fieldinfo.lookup.relatedApp.app,
								query:fieldinfo.lookup.filterCond
							};
							if (body.query.length!=0) body.query+=' and ';
							body.query+=fieldinfo.lookup.relatedKeyField+'='+field.value;
							kintone.api(kintone.api.url('/k/v1/records',true),'GET',body,function(resp){
								if (resp.records.length!=0)
								{
									var labels=[];
									var pickers=((fieldinfo.lookup.lookupPickerFields.length!=0)?fieldinfo.lookup.lookupPickerFields:[fieldinfo.lookup.relatedKeyField]);
									for (var i2=0;i2<pickers.length;i2++) labels.push($.fieldvalue(resp.records[0][pickers[i2]]));
									if ($('.label',container)) $('.label',container).text(labels.join('/'));
									$('.receiver',container).val(field.value);
								}
								else
								{
									if ($('.label',container)) $('.label',container).text(field.value);
									$('.receiver',container).val(field.value);
								}
							},function(error){
								if ($('.label',container)) $('.label',container).text(field.value);
								$('.receiver',container).val(field.value);
							});
						}
						else
						{
							if ($('.label',container)) $('.label',container).text((field.value)?field.value:'');
							$('.receiver',container).val(field.value);
						}
					}
					else
					{
						if ($('.label',container)) $('.label',container).text((field.value)?field.value:'');
						$('.receiver',container).val(field.value);
					}
					break;
			}
		},
		/* hide form */
		hide:function(){
			this.dialog.cover.hide();
		},
		/* redisplay referer */
		unhide:function(){
			this.dialog.cover.show();
		}
	};
	return new FieldsForm($.extend(true,{
		container:$(this),
		fields:[],
		callback:{
			group:null,
			organization:null,
			user:null
		},
		radionulllabel:''
	},options));
};
jTis.fn.fieldstyle=function(options){
	var FieldStyle=function(options){
		var options=$.extend(true,{
			container:null
		},options);
		/* valiable */
		var my=this;
		var families=(function(families){
			var res=[];
			var span=(function(span){
				$('body').append(span);
				return span.css({
					'display':'block',
					'font-size':'1rem',
					'left':'0',
					'opacity':'0',
					'position':'absolute',
					'top':'0'
				}).html('!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~');
			})($('<span>'));
			if (!$('.fieldstyle_style_font').size())
			{
				$('head').append(
					$('<style>')
					.addClass('fieldstyle_style_font')
					.attr('media','screen')
					.attr('type','text/css')
					.text('@font-face{font-family:Blank;src:url("data:font/opentype;base64,T1RUTwAKAIAAAwAgQ0ZGIDTeCDQAACFkAAAZPERTSUcAAAABAABKqAAAAAhPUy8yAF+xmwAAARAAAABgY21hcCRDbtEAAAdcAAAZ6GhlYWQFl9tDAAAArAAAADZoaGVhB1oD7wAAAOQAAAAkaG10eAPoAHwAADqgAAAQBm1heHAIAVAAAAABCAAAAAZuYW1lIE0HkgAAAXAAAAXrcG9zdP+4ADIAACFEAAAAIAABAAAAAQuFfcPHtV8PPPUAAwPoAAAAANFMRfMAAAAA0UxF8wB8/4gDbANwAAAAAwACAAAAAAAAAAEAAANw/4gAAAPoAHwAfANsAAEAAAAAAAAAAAAAAAAAAAACAABQAAgBAAAAAwPoAZAABQAAAooCWAAAAEsCigJYAAABXgAyANwAAAAAAAAAAAAAAAD3/67/+9///w/gAD8AAAAAQURCTwBAAAD//wNw/4gAAANwAHhgLwH/AAAAAAAAAAAAAAAgAAAAAAARANIAAQAAAAAAAQALAAAAAQAAAAAAAgAHAAsAAQAAAAAAAwAbABIAAQAAAAAABAALAAAAAQAAAAAABQA6AC0AAQAAAAAABgAKAGcAAwABBAkAAACUAHEAAwABBAkAAQAWAQUAAwABBAkAAgAOARsAAwABBAkAAwA2ASkAAwABBAkABAAWAQUAAwABBAkABQB0AV8AAwABBAkABgAUAdMAAwABBAkACAA0AecAAwABBAkACwA0AhsAAwABBAkADQKWAk8AAwABBAkADgA0BOVBZG9iZSBCbGFua1JlZ3VsYXIxLjA0NTtBREJPO0Fkb2JlQmxhbms7QURPQkVWZXJzaW9uIDEuMDQ1O1BTIDEuMDQ1O2hvdGNvbnYgMS4wLjgyO21ha2VvdGYubGliMi41LjYzNDA2QWRvYmVCbGFuawBDAG8AcAB5AHIAaQBnAGgAdAAgAKkAIAAyADAAMQAzACwAIAAyADAAMQA1ACAAQQBkAG8AYgBlACAAUwB5AHMAdABlAG0AcwAgAEkAbgBjAG8AcgBwAG8AcgBhAHQAZQBkACAAKABoAHQAdABwADoALwAvAHcAdwB3AC4AYQBkAG8AYgBlAC4AYwBvAG0ALwApAC4AQQBkAG8AYgBlACAAQgBsAGEAbgBrAFIAZQBnAHUAbABhAHIAMQAuADAANAA1ADsAQQBEAEIATwA7AEEAZABvAGIAZQBCAGwAYQBuAGsAOwBBAEQATwBCAEUAVgBlAHIAcwBpAG8AbgAgADEALgAwADQANQA7AFAAUwAgADEALgAwADQANQA7AGgAbwB0AGMAbwBuAHYAIAAxAC4AMAAuADgAMgA7AG0AYQBrAGUAbwB0AGYALgBsAGkAYgAyAC4ANQAuADYAMwA0ADAANgBBAGQAbwBiAGUAQgBsAGEAbgBrAEEAZABvAGIAZQAgAFMAeQBzAHQAZQBtAHMAIABJAG4AYwBvAHIAcABvAHIAYQB0AGUAZABoAHQAdABwADoALwAvAHcAdwB3AC4AYQBkAG8AYgBlAC4AYwBvAG0ALwB0AHkAcABlAC8AVABoAGkAcwAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIABpAHMAIABsAGkAYwBlAG4AcwBlAGQAIAB1AG4AZABlAHIAIAB0AGgAZQAgAFMASQBMACAATwBwAGUAbgAgAEYAbwBuAHQAIABMAGkAYwBlAG4AcwBlACwAIABWAGUAcgBzAGkAbwBuACAAMQAuADEALgAgAFQAaABpAHMAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAaQBzACAAZABpAHMAdAByAGkAYgB1AHQAZQBkACAAbwBuACAAYQBuACAAIgBBAFMAIABJAFMAIgAgAEIAQQBTAEkAUwAsACAAVwBJAFQASABPAFUAVAAgAFcAQQBSAFIAQQBOAFQASQBFAFMAIABPAFIAIABDAE8ATgBEAEkAVABJAE8ATgBTACAATwBGACAAQQBOAFkAIABLAEkATgBEACwAIABlAGkAdABoAGUAcgAgAGUAeABwAHIAZQBzAHMAIABvAHIAIABpAG0AcABsAGkAZQBkAC4AIABTAGUAZQAgAHQAaABlACAAUwBJAEwAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUAIABmAG8AcgAgAHQAaABlACAAcwBwAGUAYwBpAGYAaQBjACAAbABhAG4AZwB1AGEAZwBlACwAIABwAGUAcgBtAGkAcwBzAGkAbwBuAHMAIABhAG4AZAAgAGwAaQBtAGkAdABhAHQAaQBvAG4AcwAgAGcAbwB2AGUAcgBuAGkAbgBnACAAeQBvAHUAcgAgAHUAcwBlACAAbwBmACAAdABoAGkA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wwDEAMUAxgDHAMgAyQDKAMsAzADNAM4AzwDQANEA0gDTANQA1QDWANcA2ADZANoA2wDcAN0A3gDfAOAA4QDiAOMA5ADlAOYA5wDoAOkA6gDrAOwA7QDuAO8A8ADxAPIA8wD0APUA9gD3APgA+QD6APsA/AD9AP4A/wEAAQEBAgEDAQQBBQEGAQcBCAEJAQoBCwEMAQ0BDgEPARABEQESARMBFAEVARYBFwEYARkBGgEbARwBHQEeAR8BIAEhASIBIwEkASUBJgEnASgBKQEqASsBLAEtAS4BLwEwATEBMgEzATQBNQE2ATcBOAE5AToBOwE8AT0BPgE/AUABQQFCAUMBRAFFAUYBRwFIAUkBSgFLAUwBTQFOAU8BUAFRAVIBUwFUAVUBVgFXAVgBWQFaAVsBXAFdAV4BXwFgAWEBYgFjAWQBZQFmAWcBaAFpAWoBawFsAW0BbgFvAXABcQFyAXMBdAF1AXYBdwF4AXkBegF7AXwBfQF+AX8BgAGBAYIBgwGEAYUBhgGHAYgBiQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAaYBpwGoAakBqgGrAawBrQGuAa8BsAGxAbIBswG0AbUBtgG3AbgBuQG6AbsBvAG9Ab4BvwHAAcEBwgHDAcQBxQHGAccByAHJAcoBywHMAc0BzgHPAdAB0QHSAdMB1AHVAdYB1wHYAdkB2gHbAdwB3QHeAd8B4AHhAeIB4wHkAeUB5gHnAegB6QHqAesB7AHtAe4B7wHwAfEB8gHzAfQB9QH2AfcB+AH5AfoB+wH8Af0B/gH/AgACAQICAgMCBAIFAgYCBwIIAgkCCgILAgwCDQIOAg8CEAIRAhICEwIUAhUCFgIXAhgCGQIaAhsCHAIdAh4CHwIgAiECIgIjAiQCJQImAicCKAIpAioCKwIsAi0CLgIvAjACMQIyAjMCNAI1AjYCNwI4AjkCOgI7AjwCPQI+Aj8CQAJBAkICQwJEAkUCRgJHAkgCSQJKAksCTAJNAk4CTwJQAlECUgJTAlQCVQJWAlcCWAJZAloCWwJcAl0CXgJfAmACYQJiAmMCZAJlAmYCZwJoAmkCagJrAmwCbQJuAm8CcAJxAnICcwJ0AnUCdgJ3AngCeQJ6AnsCfAJ9An4CfwKAAoECggKDAoQChQKGAocCiAKJAooCiwKMAo0CjgKPApACkQKSApMClAKVApYClwKYApkCmgKbApwCnQKeAp8CoAKhAqICowKkAqUCpgKnAqgCqQKqAqsCrAKtAq4CrwKwArECsgKzArQCtQK2ArcCuAK5AroCuwK8Ar0CvgK/AsACwQLCAsMCxALFAsYCxwLIAskCygLLAswCzQLOAs8C0ALRAtIC0wLUAtUC1gLXAtgC2QLaAtsC3ALdAt4C3wLgAuEC4gLjAuQC5QLmAucC6ALpAuoC6wLsAu0C7gLvAvAC8QLyAvMC9AL1AvYC9wL4AvkC+gL7AvwC/QL+Av8DAAMBAwIDAwMEAwUDBgMHAwgDCQMKAwsDDAMNAw4DDwMQAxEDEgMTAxQDFQMWAxcDGAMZAxoDGwMcAx0DHgMfAyADIQMiAyMDJAMlAyYDJwMoAykDKgMrAywDLQMuAy8DMAMxAzIDMwM0AzUDNgM3AzgDOQM6AzsDPAM9Az4DPwNAA0EDQgNDA0QDRQNGA0cDSANJA0oDSwNMA00DTgNPA1ADUQNSA1MDVANVA1YDVwNYA1kDWgNbA1wDXQNeA18DYANhA2IDYwNkA2UDZgNnA2gDaQNqA2sDbANtA24DbwNwA3EDcgNzA3QDdQN2A3cDeAN5A3oDewN8A30DfgN/A4ADgQOCA4MDhAOFA4YDhwOIA4kDigOLA4wDjQOOA48DkAORA5IDkwOUA5UDlgOXA5gDmQOaA5sDnAOdA54DnwOgA6EDogOjA6QDpQOmA6cDqAOpA6oDqwOsA60DrgOvA7ADsQOyA7MDtAO1A7YDtwO4A7kDugO7A7wDvQO+A78DwAPBA8IDwwPEA8UDxgPHA8gDyQPKA8sDzAPNA84DzwPQA9ED0gPTA9QD1QPWA9cD2APZA9oD2wPcA90D3gPfA+AD4QPiA+MD5APlA+YD5wPoA+kD6gPrA+wD7QPuA+8D8APxA/ID8wP0A/UD9gP3A/gD+QP6A/sD/AP9A/4D/wQABAEEAgQDBAQEBQQGBAcECAQJBAoECwQMBA0EDgQPBBAEEQQSBBMEFAQVBBYEFwQYBBkEGgQbBBwEHQQeBB8EIAQhBCIEIwQkBCUEJgQnBCgEKQQqBCsELAQtBC4ELwQwBDEEMgQzBDQENQQ2BDcEOAQ5BDoEOwQ8BD0EPgQ/BEAEQQRCBEMERARFBEYERwRIBEkESgRLBEwETQROBE8EUARRBFIEUwRUBFUEVgRXBFgEWQRaBFsEXARdBF4EXwRgBGEEYgRjBGQEZQRmBGcEaARpBGoEawRsBG0EbgRvBHAEcQRyBHMEdAR1BHYEdwR4BHkEegR7BHwEfQR+BH8EgASBBIIEgwSEBIUEhgSHBIgEiQSKBIsEjASNBI4EjwSQBJEEkgSTBJQElQSWBJcEmASZBJoEmwScBJ0EngSfBKAEoQSiBKMEpASlBKYEpwSoBKkEqgSrBKwErQSuBK8EsASxBLIEswS0BLUEtgS3BLgEuQS6BLsEvAS9BL4EvwTABMEEwgTDBMQExQTGBMcEyATJBMoEywTMBM0EzgTPBNAE0QTSBNME1ATVBNYE1wTYBNkE2gTbBNwE3QTeBN8E4AThBOIE4wTkBOUE5gTnBOgE6QTqBOsE7ATtBO4E7wTwBPEE8gTzBPQE9QT2BPcE+AT5BPoE+wT8BP0E/gT/BQAFAQUCBQMFBAUFBQYFBwUIBQkFCgULBQwFDQUOBQ8FEAURBRIFEwUUBRUFFgUXBRgFGQUaBRsFHAUdBR4FHwUgBSEFIgUjBSQFJQUmBScFKAUpBSoFKwUsBS0FLgUvBTAFMQUyBTMFNAU1BTYFNwU4BTkFOgU7BTwFPQU+BT8FQAVBBUIFQwVEBUUFRgVHBUgFSQVKBUsFTAVNBU4FTwVQBVEFUgVTBVQFVQVWBVcFWAVZBVoFWwVcBV0FXgVfBWAFYQViBWMFZAVlBWYFZwVoBWkFagVrBWwFbQVuBW8FcAVxBXIFcwV0BXUFdgV3BXgFeQV6BXsFfAV9BX4FfwWABYEFggWDBYQFhQWGBYcFiAWJBYoFiwWMBY0FjgWPBZAFkQWSBZMFlAWVBZYFlwWYBZkFmgWbBZwFnQWeBZ8FoAWhBaIFowWkBaUFpgWnBagFqQWqBasFrAWtBa4FrwWwBbEFsgWzBbQFtQW2BbcFuAW5BboFuwW8Bb0FvgW/BcAFwQXCBcMFxAXFBcYFxwXIBckFygXLBcwFzQXOBc8F0AXRBdIF0wXUBdUF1gXXBdgF2QXaBdsF3AXdBd4F3wXgBeEF4gXjBeQF5QXmBecF6AXpBeoF6wXsBe0F7gXvBfAF8QXyBfMF9AX1BfYF9wX4BfkF+gX7BfwF/QX+Bf8GAAYBBgIGAwYEBgUGBgYHBggGCQYKBgsGDAYNBg4GDwYQBhEGEgYTBhQGFQYWBhcGGAYZBhoGGwYcBh0GHgYfBiAGIQYiBiMGJAYlBiYGJwYoBikGKgYrBiwGLQYuBi8GMAYxBjIGMwY0BjUGNgY3BjgGOQY6BjsGPAY9Bj4GPwZABkEGQgZDBkQGRQZGBkcGSAZJBkoGSwZMBk0GTgZPBlAGUQZSBlMGVAZVBlYGVwZYBlkGWgZbBlwGXQZeBl8GYAZhBmIGYwZkBmUGZgZnBmgGaQZqBmsGbAZtBm4GbwZwBnEGcgZzBnQGdQZ2BncGeAZ5BnoGewZ8Bn0GfgZ/BoAGgQaCBoMGhAaFBoYGhwaIBokGigaLBowGjQaOBo8GkAaRBpIGkwaUBpUGlgaXBpgGmQaaBpsGnAadBp4GnwagBqEGogajBqQGpQamBqcGqAapBqoGqwasBq0GrgavBrAGsQayBrMGtAa1BrYGtwa4BrkGuga7BrwGvQa+Br8GwAbBBsIGwwbEBsUGxgbHBsgGyQbKBssGzAbNBs4GzwbQBtEG0gbTBtQG1QbWBtcG2AbZBtoG2wbcBt0G3gbfBuAG4QbiBuMG5AblBuYG5wboBukG6gbrBuwG7QbuBu8G8AbxBvIG8wb0BvUG9gb3BvgG+Qb6BvsG/Ab9Bv4G/wcABwEHAgcDBwQHBQcGBwcHCAcJBwoHCwcMBw0HDgcPBxAHEQcSBxMHFAcVBxYHFwcYBxkHGgcbBxwHHQceBx8HIAchByIHIwckByUHJgcnBygHKQcqBysHLActBy4HLwcwBzEHMgczBzQHNQc2BzcHOAc5BzoHOwc8Bz0HPgc/B0AHQQdCB0MHRAdFB0YHRwdIB0kHSgdLB0wHTQdOB08HUAdRB1IHUwdUB1UHVgdXB1gHWQdaB1sHXAddB14HXwdgB2EHYgdjB2QHZQdmB2cHaAdpB2oHawdsB20HbgdvB3AHcQdyB3MHdAd1B3YHdwd4B3kHegd7B3wHfQd+B38HgAeBB4IHgweEB4UHhgeHB4gHiQeKB4sHjAeNB44HjweQB5EHkgeTB5QHlQeWB5cHmAeZB5oHmwecB50HngefB6AHoQeiB6MHpAelB6YHpweoB6kHqgerB6wHrQeuB68HsAexB7IHswe0B7UHtge3B7gHuQe6B7sHvAe9B74HvwfAB8EHwgfDB8QHxQfGB8cHyAfJB8oHywfMB80HzgfPB9AH0QfSB9MH1AfVB9YH1wfYB9kH2gfbB9wH3QfeB98H4AfhB+IH4wfkB+UH5gfnB+gH6QfqB+sH7AftB+4H7wfwB/EH8gfzB/QH9Qf2B/cH+Af5B/oH+wf8B/0H/gf/CAAIAQgCCAMIBAgFCAYIBwgICAkICggLCAwIDQgOCA8IEAgRCBIIEwgUCBUIFggXCBgIGQgaCBsIHAgdCB4IHwggCCEIIggjCCQIJQgmCCcIKAgpCCoIKwgsCC0ILggvCDAIMQgyCDMINAg1CDYINwg4CDkIOgg7CDwIPQg+CD8IQAhBCEIIQwhECEUIRghHCEgISQhKCEsg+wy3+iS3AfcQt/kstwP3EPoEFf58+YT6fAf9WP4nFfnSB/fF/DMFprAV+8X4NwX49gamYhX90gf7xfgzBXBmFffF/DcF/PYGDg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4OAAEBAQr4HwwmmhwZLRL7joscBUaLBr0KvQv65xUD6AB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAA==");}')
				);
			}
			for (var i=0;i<families.length;i++)
			{
				span.css({'font-family':'"'+families[i]+'",Blank'});
				if (span[0].offsetWidth>0) res.push({name:families[i]});
			}
			span.remove();
			return res;
		})([
			'MS UI Gothic',
			'ＭＳ Ｐゴシック',
			'ＭＳ ゴシック',
			'ＭＳ Ｐ明朝',
			'ＭＳ 明朝',
			'メイリオ',
			'Meiryo UI',
			'游ゴシック',
			'游明朝',
			'ヒラギノ角ゴ Pro W3',
			'ヒラギノ角ゴ ProN W3',
			'ヒラギノ角ゴ Pro W6',
			'ヒラギノ角ゴ ProN W6',
			'ヒラギノ角ゴ Std W8',
			'ヒラギノ角ゴ StdN W8',
			'ヒラギノ丸ゴ Pro W4',
			'ヒラギノ丸ゴ ProN W4',
			'ヒラギノ明朝 Pro W3',
			'ヒラギノ明朝 ProN W3',
			'ヒラギノ明朝 Pro W6',
			'ヒラギノ明朝 ProN W6',
			'游ゴシック体',
			'游明朝体',
			'游明朝体+36ポかな',
			'HG行書体',
			'HGP行書体',
			'HG正楷書体-PRO',
			'クレー',
			'筑紫A丸ゴシック',
			'筑紫B丸ゴシック',
			'Osaka',
			'Osaka－等幅',
			'Droid Sans',
			'Roboto',
			'cursive',
			'Comic Sans MS',
			'Jenkins v2.0',
			'Mv Boli',
			'Script',
			'sans-serif',
			'arial',
			'arial black',
			'arial narrow',
			'arial unicode ms',
			'Century Gothic',
			'Franklin Gothic Medium',
			'Gulim',
			'GulimChe',
			'Dotum',
			'Haettenschweiler',
			'Impact',
			'Lucida Sans Unicode',
			'Microsoft Sans Serif',
			'MS Sans Serif',
			'MV Boil',
			'New Gulim',
			'Tahoma',
			'Trebuchet',
			'Trebuchet MS',
			'Verdana',
			'serif',
			'Batang',
			'Book Antiqua',
			'Bookman Old Style',
			'Century',
			'Estrangelo Edessa',
			'Garamond',
			'Gautami',
			'Georgia',
			'Gungsuh',
			'Latha',
			'Mangal',
			'MS Serif',
			'NSimSun',
			'PMingLiU',
			'Palatino Linotype',
			'Raavi',
			'Roman',
			'Shruti',
			'Sylfaen',
			'Times New Roman',
			'Tunga',
			'monospace',
			'BatangChe',
			'Courier',
			'Courier New',
			'DotumChe',
			'GlimChe',
			'GungsuhChe',
			'Lucida Console',
			'MingLiU',
			'OCRB',
			'SimHei',
			'SimSun',
			'Small Fonts',
			'Terminal',
			'fantasy',
			'alba',
			'alba matter',
			'alba super',
			'baby kruffy',
			'Chick',
			'Croobie',
			'Fat',
			'Freshbot',
			'Frosty',
			'GlooGun',
			'Jokewood',
			'Modern',
			'Monotype Corsiva',
			'Poornut',
			'Pussycat Snickers',
			'Weltron Urban'
		]);
		var createborderoptions=function(position,label){
			return div.clone(true).css({'padding':'5px','width':'100%'})
			.append(span.clone(true).css({'padding':'0px 5px','width':'5em'}).text(label))
			.append(
				(function(radio){
					$('.label',radio).html('なし');
					$('.receiver',radio).attr('id','none').attr('name','border-'+position+'-style');
					return radio;
				})(radio.clone(true))
			)
			.append(
				(function(radio){
					$('.label',radio).html('実線');
					$('.receiver',radio).attr('id','solid').attr('name','border-'+position+'-style');
					return radio;
				})(radio.clone(true))
			)
			.append(
				(function(radio){
					$('.label',radio).html('破線');
					$('.receiver',radio).attr('id','dotted').attr('name','border-'+position+'-style');
					return radio;
				})(radio.clone(true))
			)
			.append(span.clone(true).css({'padding':'0px 5px'}).text('太さ'))
			.append(
				(function(input){
					input.css({'text-align':'right','width':'3em'}).attr('id','border-'+position+'-width');
					return input;
				})(textline.clone(true))
			)
			.append(span.clone(true).css({'padding':'0px 5px'}).text('px'))
			.append(span.clone(true).css({'padding':'0px 5px'}).text('色'))
			.append(
				(function(color){
					color.css({'border':'1px solid #C9C9C9','border-radius':'3px','height':'30px','width':'2em'}).attr('id','border-'+position+'-color-monitor')
					.append($('<input type="hidden">').attr('id','border-'+position+'-color'));
					return color;
				})(span.clone(true))
			)
		}
		/* property */
		this.keep={};
		this.dialog=createdialog('standard',475,500);
		this.contents=this.dialog.contents;
		this.colors=[
			'#FA8273',
			'#FFF07D',
			'#7DC87D',
			'#69B4C8',
			'#827DB9',
			'#E16EA5',
			'#FA7382',
			'#FFB46E',
			'#B4DC69',
			'#64C3AF',
			'#69A0C8',
			'#B473B4',
			'#FFFFFF',
			'#D6D1CC',
			'#888888',
			'#333333',
		];
		/* append elements */
		options.container.append(
			this.dialog.container.css({
				'bottom':'auto',
				'display':'none',
				'left':'50%',
				'padding-top':'40px',
				'position':'fixed',
				'right':'auto',
				'top':'50%',
				'transform':'translate(-50%,-50%)',
				'z-index':'999999'
			})
			.append(
				this.dialog.contents
				.append(createborderoptions('left','左罫線'))
				.append(createborderoptions('right','右罫線'))
				.append(createborderoptions('top','上罫線'))
				.append(createborderoptions('bottom','下罫線'))
				.append(
					div.clone(true).css({'padding':'5px','width':'100%'})
					.append(span.clone(true).css({'padding':'0px 5px','width':'5em'}).text('フォント'))
					.append(
						(function(select){
							select.attr('id','font-family');
							for (var i=0;i<families.length;i++)	select.append($('<option>').attr('value',families[i].name).text(families[i].name))
							return select
						})(select.clone(true))
					)
				)
				.append(
					div.clone(true).css({'padding':'5px','width':'100%'})
					.append(span.clone(true).css({'padding':'0px 5px','width':'5em'}).text('サイズ'))
					.append(
						(function(input){
							input.css({'text-align':'right','width':'3em'}).attr('id','font-size');
							return input;
						})(textline.clone(true))
					)
					.append(span.clone(true).css({'padding':'0px 5px'}).text('px'))
					.append(span.clone(true).css({'padding':'0px 5px'}).text('色'))
					.append(
						(function(color){
							color.css({'border':'1px solid #C9C9C9','border-radius':'3px','height':'30px','width':'2em'}).attr('id','color-monitor')
							.append($('<input type="hidden">').attr('id','color'));
							return color;
						})(span.clone(true))
					)
				)
				.append(
					div.clone(true).css({'padding':'5px','width':'100%'})
					.append(span.clone(true).css({'padding':'0px 5px','width':'5em'}).addClass('sizelabel'))
					.append(
						(function(input){
							input.css({'text-align':'right','width':'3em'}).attr('id','size');
							return input;
						})(textline.clone(true))
					)
					.append(span.clone(true).css({'padding':'0px 5px'}).text('px'))
					.append($('<p>').css({'color':'#d80000','font-size':'13px'}).addClass('sizecaution'))
				)
			)
			.append(
				this.dialog.header.css({'cursor':'grab'}).on('mousedown.fieldstyle',function(e){
					var keep={
						rect:my.dialog.container[0].getBoundingClientRect(),
						pageX:e.pageX,
						pageY:e.pageY
					};
					my.dialog.header.css({'cursor':'grabbing'});
					$(window).off('mousemove.fieldstyle').on('mousemove.fieldstyle',function(e){
						var left=keep.rect.left+keep.rect.width/2+e.pageX-keep.pageX;
						var top=keep.rect.top+keep.rect.height/2+e.pageY-keep.pageY;
						my.dialog.container.css({'left':left.toString()+'px','top':top.toString()+'px'});
						e.stopPropagation();
						e.preventDefault();
					});
					$(window).off('mouseup.fieldstyle').on('mouseup.fieldstyle',function(e){
						my.dialog.header.css({'cursor':'grab'});
						$(window).off('mousemove.fieldstyle');
						$(window).off('mouseup.fieldstyle');
						e.stopPropagation();
						e.preventDefault();
					});
					e.stopPropagation();
					e.preventDefault();
				})
			)
			.append(
				this.dialog.footer
				.append(button.clone(true).attr('id','ok').text('OK'))
				.append(button.clone(true).attr('id','cancel').text('Cancel'))
			)
		);
	};
	FieldStyle.prototype={
		/* display dialog */
		show:function(css,size,callback,ok,cancel,preview){
			var my=this;
			var positions=['left','right','top','bottom'];
			var createcss=function(){
				var res={};
				for (var i=0;i<positions.length;i++)
				{
					switch ($('[name=border-'+positions[i]+'-style]:checked',my.dialog.contents).attr('id'))
					{
						case 'none':
							res['border-'+positions[i]]='none';
							break;
						case 'solid':
							if (!$.isNumeric($('#border-'+positions[i]+'-width',my.dialog.contents).val())) $('#border-'+positions[i]+'-width',my.dialog.contents).val('0');
							res['border-'+positions[i]]=$('#border-'+positions[i]+'-width',my.dialog.contents).val()+'px solid #'+$('#border-'+positions[i]+'-color').val();
							break;
						case 'dotted':
							if (!$.isNumeric($('#border-'+positions[i]+'-width',my.dialog.contents).val())) $('#border-'+positions[i]+'-width',my.dialog.contents).val('0');
							if (parseInt($('#border-'+positions[i]+'-width',my.dialog.contents).val())>1)
							{
								alert('破線の場合は太さは1pxに限定されます。');
								$('#border-'+positions[i]+'-width',my.dialog.contents).val('1');
							}
							res['border-'+positions[i]]=$('#border-'+positions[i]+'-width',my.dialog.contents).val()+'px dotted #'+$('#border-'+positions[i]+'-color').val();
							break;
					}
				}
				res['color']='#'+$('#color',my.dialog.contents).val();
				res['font-size']=$('#font-size',my.dialog.contents).val()+'px';
				if ($('#font-family',my.dialog.contents).val()) res['font-family']=$('#font-family',my.dialog.contents).val();
				return res;
			};
			var createsize=function(){
				return ($.isNumeric($('#size',my.dialog.contents).val()))?$('#size',my.dialog.contents).val():'0';
			};
			this.keep=css;
			$('#ok',this.dialog.footer).off('click').on('click',function(){
				ok(createcss(),createsize());
				my.hide();
			});
			$('#cancel',this.dialog.footer).off('click').on('click',function(){
				cancel(my.keep,size);
				my.hide();
			});
			$('#font-family',my.dialog.contents).off('change').on('change',function(e){preview(createcss(),createsize());});
			$('#font-size',my.dialog.contents).off('change').on('change',function(e){preview(createcss(),createsize());});
			$('#size',my.dialog.contents).off('change').on('change',function(e){preview(createcss(),createsize());});
			for (var i=0;i<positions.length;i++)
			{
				$('#border-'+positions[i]+'-width',my.dialog.contents).off('change').on('change',function(e){preview(createcss(),createsize());});
				$('[name=border-'+positions[i]+'-style]',my.dialog.contents).each(function(index){
					$(this).off('change').on('change',function(e){
						preview(createcss(),createsize());
					});
				});
				if ('border-'+positions[i] in css)
				{
					if (css['border-'+positions[i]].match(/none/g))
					{
						$('[name=border-'+positions[i]+'-style]#none').prop('checked',true);
						$('#border-'+positions[i]+'-width').val('');
						$('#border-'+positions[i]+'-color').val('888888');
						$('#border-'+positions[i]+'-color-monitor').colorSelector(this.colors,$('#border-'+positions[i]+'-color'),function(e){preview(createcss(),createsize());});
					}
					else
					{
						if (css['border-'+positions[i]].match(/solid/g)) $('[name=border-'+positions[i]+'-style]#solid').prop('checked',true);
						if (css['border-'+positions[i]].match(/dotted/g)) $('[name=border-'+positions[i]+'-style]#dotted').prop('checked',true);
						$('#border-'+positions[i]+'-width').val(parseInt(css['border-'+positions[i]].split(' ')[0]));
						$('#border-'+positions[i]+'-color').val(this.hex(css['border-'+positions[i]]));
						$('#border-'+positions[i]+'-color-monitor').colorSelector(this.colors,$('#border-'+positions[i]+'-color'),function(e){preview(createcss(),createsize());});
					}
				}
				else
				{
					$('[name=border-'+positions[i]+'-style]#none').prop('checked',true);
					$('#border-'+positions[i]+'-width').val('');
					$('#border-'+positions[i]+'-color').val('888888');
					$('#border-'+positions[i]+'-color-monitor').colorSelector(this.colors,$('#border-'+positions[i]+'-color'),function(e){preview(createcss(),createsize());});
				}
			}
			if ('color' in css)
			{
				$('#color',my.dialog.contents).val(this.hex(css['color']));
				$('#color-monitor').colorSelector(this.colors,$('#color'),function(e){preview(createcss(),createsize());});
			}
			if ('font-size' in css) $('#font-size',my.dialog.contents).val(parseInt(css['font-size']));
			if ('font-family' in css) $('#font-family',my.dialog.contents).val(css['font-family']);
			$('#size',my.dialog.contents).val(size).closest('div').show();
			callback(this.dialog.container);
			this.dialog.container.show();
		},
		/* hide dialog */
		hide:function(){
			this.dialog.container.hide();
		},
		/* exchange hex */
		hex:function(rgb){
			var res=rgb;
			if (res.match(/rgb/g))
			{
				res=res.replace(/ /g,'').replace(/^.*rgb[a]?\(/g,'').replace(/\)$/g,'').split(',');
				if (res.length==4) res.splice(3,1);
				res=res.map(function(value){
					var sin="0123456789ABCDEF";
					if(value>255) return 'FF';
					if(value<0) return '00';
					return sin.charAt(Math.floor(value/16))+sin.charAt(value%16);
				}).join('');
			}
			else res=res.replace(/^.*#/g,'')
			return res;
		}
	};
	return new FieldStyle($.extend(true,{container:$(this)},options));
};
jTis.fn.fieldwidth=function(options){
	var FieldWidth=function(options){
		var options=$.extend(true,{
			container:null
		},options);
		/* valiable */
		var my=this;
		/* property */
		this.dialog=createdialog('standard',200,300);
		this.contents=this.dialog.contents;
		/* append elements */
		options.container.append(
			this.dialog.container.css({
				'bottom':'auto',
				'display':'none',
				'left':'50%',
				'padding-top':'40px',
				'position':'fixed',
				'right':'auto',
				'top':'50%',
				'transform':'translate(-50%,-50%)',
				'z-index':'999999'
			})
			.append(
				this.dialog.contents
				.append(
					div.clone(true).css({'padding':'5px','width':'100%'})
					.append(span.clone(true).css({'padding':'0px 5px','width':'8em'}).text('フィールド幅'))
					.append(
						(function(input){
							input.css({'text-align':'right','width':'6em'}).attr('id','width');
							return input;
						})(textline.clone(true))
					)
					.append(span.clone(true).css({'padding':'0px 5px'}).text('px'))
					.append($('<p>').css({'color':'#d80000','font-size':'13px'}).text('「0」を指定した場合は印刷プレビュー時に非表示に出来ます。'))
				)
			)
			.append(
				this.dialog.header.css({'cursor':'grab'}).on('mousedown.fieldwidth',function(e){
					var keep={
						rect:my.dialog.container[0].getBoundingClientRect(),
						pageX:e.pageX,
						pageY:e.pageY
					};
					my.dialog.header.css({'cursor':'grabbing'});
					$(window).off('mousemove.fieldwidth').on('mousemove.fieldwidth',function(e){
						var left=keep.rect.left+keep.rect.width/2+e.pageX-keep.pageX;
						var top=keep.rect.top+keep.rect.height/2+e.pageY-keep.pageY;
						my.dialog.container.css({'left':left.toString()+'px','top':top.toString()+'px'});
						e.stopPropagation();
						e.preventDefault();
					});
					$(window).off('mouseup.fieldwidth').on('mouseup.fieldwidth',function(e){
						my.dialog.header.css({'cursor':'grab'});
						$(window).off('mousemove.fieldwidth');
						$(window).off('mouseup.fieldwidth');
						e.stopPropagation();
						e.preventDefault();
					});
					e.stopPropagation();
					e.preventDefault();
				})
			)
			.append(
				this.dialog.footer
				.append(button.clone(true).attr('id','ok').text('OK'))
				.append(button.clone(true).attr('id','cancel').text('Cancel'))
			)
		);
	};
	FieldWidth.prototype={
		/* display dialog */
		show:function(width,ok,cancel,preview){
			var my=this;
			$('#ok',this.dialog.footer).off('click').on('click',function(){
				ok(($.isNumeric($('#width',my.dialog.contents).val()))?$('#width',my.dialog.contents).val():'0');
				my.hide();
			});
			$('#cancel',this.dialog.footer).off('click').on('click',function(){
				cancel(width);
				my.hide();
			});
			$('#width',my.dialog.contents).off('change').on('change',function(e){preview(($.isNumeric($('#width',my.dialog.contents).val()))?$('#width',my.dialog.contents).val():'0');});
			$('#width',my.dialog.contents).val(width);
			this.dialog.container.show();
		},
		/* hide dialog */
		hide:function(){
			this.dialog.container.hide();
		}
	};
	return new FieldWidth($.extend(true,{container:$(this)},options));
};
jTis.fn.fieldrowwidth=function(options){
	var FieldRowWidth=function(options){
		var options=$.extend(true,{
			container:null
		},options);
		/* valiable */
		var my=this;
		/* property */
		this.dialog=createdialog('standard',150,300);
		this.contents=this.dialog.contents;
		/* append elements */
		options.container.append(
			this.dialog.container.css({
				'bottom':'auto',
				'display':'none',
				'left':'50%',
				'padding-top':'40px',
				'position':'fixed',
				'right':'auto',
				'top':'50%',
				'transform':'translate(-50%,-50%)',
				'z-index':'999999'
			})
			.append(
				this.dialog.contents
				.append(
					div.clone(true).css({'padding':'5px','width':'100%'})
					.append(span.clone(true).css({'padding':'0px 5px','width':'8em'}).text('フィールド列幅'))
					.append(
						(function(input){
							input.css({'text-align':'right','width':'6em'}).attr('id','width');
							return input;
						})(textline.clone(true))
					)
					.append(span.clone(true).css({'padding':'0px 5px'}).text('px'))
				)
			)
			.append(
				this.dialog.header.css({'cursor':'grab'}).on('mousedown.fieldrowwidth',function(e){
					var keep={
						rect:my.dialog.container[0].getBoundingClientRect(),
						pageX:e.pageX,
						pageY:e.pageY
					};
					my.dialog.header.css({'cursor':'grabbing'});
					$(window).off('mousemove.fieldrowwidth').on('mousemove.fieldrowwidth',function(e){
						var left=keep.rect.left+keep.rect.width/2+e.pageX-keep.pageX;
						var top=keep.rect.top+keep.rect.height/2+e.pageY-keep.pageY;
						my.dialog.container.css({'left':left.toString()+'px','top':top.toString()+'px'});
						e.stopPropagation();
						e.preventDefault();
					});
					$(window).off('mouseup.fieldrowwidth').on('mouseup.fieldrowwidth',function(e){
						my.dialog.header.css({'cursor':'grab'});
						$(window).off('mousemove.fieldrowwidth');
						$(window).off('mouseup.fieldrowwidth');
						e.stopPropagation();
						e.preventDefault();
					});
					e.stopPropagation();
					e.preventDefault();
				})
			)
			.append(
				this.dialog.footer
				.append(button.clone(true).attr('id','ok').text('OK'))
				.append(button.clone(true).attr('id','cancel').text('Cancel'))
			)
		);
	};
	FieldRowWidth.prototype={
		/* display dialog */
		show:function(width,ok,cancel,preview){
			var my=this;
			$('#ok',this.dialog.footer).off('click').on('click',function(){
				ok(($.isNumeric($('#width',my.dialog.contents).val()))?$('#width',my.dialog.contents).val():'0');
				my.hide();
			});
			$('#cancel',this.dialog.footer).off('click').on('click',function(){
				cancel(width);
				my.hide();
			});
			$('#width',my.dialog.contents).off('change').on('change',function(e){preview(($.isNumeric($('#width',my.dialog.contents).val()))?$('#width',my.dialog.contents).val():'0');});
			$('#width',my.dialog.contents).val(width);
			this.dialog.container.show();
		},
		/* hide dialog */
		hide:function(){
			this.dialog.container.hide();
		}
	};
	return new FieldRowWidth($.extend(true,{container:$(this)},options));
};
jTis.fn.fileselect=function(){
	var FileSelect=function(options){
		var options=$.extend(true,{
			container:null
		},options);
		/* valiable */
		var my=this;
		/* property */
		this.dialog=createdialog('standard',600,500);
		this.contents=this.dialog.contents;
		this.files={};
		/* append elements */
		$('.main',this.dialog.header)
		.append(
			$('<input type="file">').css({'display':'none'}).on('change',function(){
				var target=$(this);
				var uploadtime=new Date().getTime().toString();
				if (target[0].files.length!=0)
					my.upload(target[0].files[0]).then(function(res){
						var values={
							contentType:target[0].files[0].type,
							fileKey:JSON.parse(res).fileKey,
							name:target[0].files[0].name,
							uploadtime:uploadtime
						};
						my.files[uploadtime]=target[0].files[0];
						my.addrow(values);
					});
			})
		)
		.append(
			button.clone(true).css({'background-color':'#FFFFFF','color':'#3498db','margin':'0px','width':'100%'})
			.text('ファイルを追加')
			.on('click',function(){
				$(this).closest('div').find('input').click();
			})
		);
		this.dialog.contents.append(this.dialog.lists);
		this.dialog.container.append(this.dialog.contents);
		this.dialog.container.append(this.dialog.header);
		this.dialog.container.append(
			this.dialog.footer
			.append(button.clone(true).attr('id','ok').text('OK'))
			.append(button.clone(true).attr('id','cancel').text('Cancel'))
		);
		this.dialog.cover.append(this.dialog.container.css({'padding-top':'40px'}));
		options.container.append(this.dialog.cover);
		/* create template */
		this.template=$('<tr>')
		.append(
			cell.clone(true).css({'border':'none','border-bottom':'1px dotted #C9C9C9','padding':'0px 5px'})
			.append(
				$('<a href="" id="link">').on('click',function(e){
					var list=$(this).closest('tr');
					my.download(list.find('input#fileKey').val()).then(function(blob){
						if (window.navigator.msSaveBlob) window.navigator.msSaveOrOpenBlob(blob,list.find('input#name').val());
						else
						{
							var url=window.URL || window.webkitURL;
							var a=document.createElement('a');
							a.setAttribute('href',url.createObjectURL(blob));
							a.setAttribute('target','_blank');
							a.setAttribute('download',list.find('input#name').val());
							a.style.display='none';
							document.body.appendChild(a);
							a.click();
							document.body.removeChild(a);
						}
					});
					e.preventDefault();
					e.stopPropagation();
					return false;
				})
			)
			.append($('<input type="hidden" id="contentType">'))
			.append($('<input type="hidden" id="fileKey">'))
			.append($('<input type="hidden" id="name">'))
			.append($('<input type="hidden" id="uploadtime">'))
		)
		.append(
			cell.clone(true).css({'border':'none','border-bottom':'1px dotted #C9C9C9','width':'30px'})
			.append(
				$('<img src="https://tis2010.jp/library/kintone/images/close.png" alt="削除" title="削除">')
				.css({'vertical-align':'middle;','width':'100%'})
				.on('click',function(){
					$(this).closest('tr').remove();
				})
			)
		);
	};
	FileSelect.prototype={
		/* download */
		download:function(fileKey)
		{
			return new Promise(function(resolve,reject)
			{
				var url=kintone.api.url('/k/v1/file',true)+'?fileKey='+fileKey;
				var xhr=new XMLHttpRequest();
				xhr.open('GET',url);
				xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
				xhr.responseType='blob';
				xhr.onload=function(){
					if (xhr.status===200) resolve(xhr.response);
					else reject(Error('File download error:' + xhr.statusText));
				};
				xhr.onerror=function(){
					reject(Error('There was a network error.'));
				};
				xhr.send();
			});
		},
		/* upload */
		upload:function(file){
			return new Promise(function(resolve,reject)
			{
				var blob=new Blob([file],{type:file.type});
				var filedata=new FormData();
				var url=kintone.api.url('/k/v1/file',true);
				var xhr=new XMLHttpRequest();
				filedata.append('__REQUEST_TOKEN__',kintone.getRequestToken());
				filedata.append('file',blob,file.name);
				xhr.open('POST',url,false);
				xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
				xhr.responseType='multipart/form-data';
				xhr.onload=function(){
					if (xhr.status===200) resolve(xhr.responseText);
					else reject(Error('File upload error:' + xhr.statusText));
				};
				xhr.onerror=function(){
					reject(Error('There was a network error.'));
				};
				xhr.send(filedata);
			});
		},
		/* add row */
		addrow:function(values){
			var list=this.template.clone(true);
			list.find('input#contentType').val(values.contentType);
			list.find('input#fileKey').val(values.fileKey);
			list.find('input#name').val(values.name);
			list.find('input#uploadtime').val(('uploadtime' in values)?values.uploadtime:'');
			list.find('a#link').text(values.name);
			this.dialog.lists.find('tbody').append(list);
		},
		/* display referer */
		show:function(options){
			var options=$.extend(true,{
				datasource:[],
				buttons:{},
				files:{}
			},options);
			var my=this;
			/* buttons callback */
			$.each(options.buttons,function(key,values){
				if (my.dialog.footer.find('button#'+key).size())
					my.dialog.footer.find('button#'+key).off('click').on('click',function(){
						if (values!=null)
						{
							var res=[];
							$.each(my.dialog.lists.find('tbody').find('tr'),function(){
								res.push({
									contentType:$(this).find('input#contentType').val(),
									fileKey:$(this).find('input#fileKey').val(),
									name:$(this).find('input#name').val(),
									uploadtime:$(this).find('input#uploadtime').val(),
									blob:(function(key){
										var res=null;
										if (key)
											if (key in my.files) res=my.files[key];
										return res;
									})($(this).find('input#uploadtime').val())
								});
							});
							values(res);
						}
					});
			});
			/* create lists */
			this.files=options.files;
			this.dialog.lists.find('tbody').empty();
			$.each(options.datasource,function(index){my.addrow(options.datasource[index]);});
			this.dialog.cover.show();
		},
		/* hide referer */
		hide:function(){
			this.dialog.cover.hide();
		},
		/* redisplay referer */
		unhide:function(){
			this.dialog.cover.show();
		}
	};
	return new FileSelect({container:$(this)});
};
jTis.fn.inlinebrowser=function(options){
	var InlineBrowser=function(options){
		var options=$.extend(true,{
			container:null,
			useframe:true,
			hidden:[]
		},options);
		var my=this;
		/* property */
		this.callback=null;
		this.timer=0;
		this.hidden=options.hidden;
		this.useframe=options.useframe;
		this.dialog=createdialog('dark');
		if (this.useframe)
		{
			this.dialog.contents
			.append(
				$('<iframe>').addClass('inlinebrowser-block').css({
					'border':'none',
					'height':'100%',
					'outline':'none',
					'overflow':'auto',
					'width':'100%'
				})
			);
		}
		else
		{
			this.dialog.contents
			.append(
				$('<div>').addClass('inlinebrowser-block').css({
					'box-sizing':'border-box',
					'height':'100%',
					'overflow':'auto',
					'width':'100%'
				})
			);
		}
		options.container.append(
			this.dialog.cover.append(
				this.dialog.container
				.append(
					this.dialog.header
					.append(
						this.dialog.button.clone(true)
						.attr('src','https://tis2010.jp/library/kintone/images/browse_close.svg')
						.on('click',function(){
							if (my.callback) my.callback();
							my.hide();
						})
					)
				)
				.append(this.dialog.contents)
			)
		);
	};
	InlineBrowser.prototype={
		/* show form */
		show:function(url,callback){
			var my=this;
			this.timer=0;
			this.callback=callback;
			if (this.useframe)
			{
				if ($('.inlinebrowser-block',this.dialog.contents).attr('src')==url)
				{
					$('.inlinebrowser-block',this.dialog.contents)[0].contentDocument.location.replace(url);
					my.dialog.cover.show();
				}
				else
				{
					$('.inlinebrowser-block',this.dialog.contents).attr('src',url).on('load',function(){
						(function(contents){
							var regex=new RegExp('^(https:\/\/'+window.location.host.replace(/[\/\\^$*+?.()|\[\]{}]/g,'\\$&')+'|\/k\/)','g');
							$('[class*=app-titlebar]',contents).css({'display':'none'});
							$('[class$=app-toolbar]',contents).css({'display':'table'});
							for (var i=0;i<my.hidden.length;i++) $(my.hidden[i],contents).css({'display':'none'});
							my.timer=setInterval(function(){
								$.each($('a',contents),function(index){
									var href=$(this).attr('href');
									if (href)
										if (href.match(regex))
											if ($(this).attr('target')=='_blank') $(this).attr('target','_self');
								});
							},250);
							setTimeout(function(){
								$('.layout-gaia',contents).css({'width':'auto'});
								$('.component-app-lookup-inputlookup',contents).each(function(index){
									var width=$(this).width();
									$('button',$(this)).each(function(index){
										width-=$(this).outerWidth();
									});
									$('.input-text-outer-cybozu',$(this)).css({'width':width+'px'});
								});
							},250);
							my.dialog.cover.show();
							/* force resize */
							$('.inlinebrowser-block',my.dialog.contents).width($('.inlinebrowser-block',my.dialog.contents).width()-1);
							$('.inlinebrowser-block',my.dialog.contents).width($('.inlinebrowser-block',my.dialog.contents).width()+1);
						})($('.inlinebrowser-block',my.dialog.contents).contents());
					});
				}
			}
			else my.dialog.cover.show();
		},
		/* hide form */
		hide:function(){
			if (this.timer>0) clearInterval(this.timer);
			this.dialog.cover.hide();
		}
	};
	return new InlineBrowser($.extend(true,{container:$(this)},options));
};
jTis.fn.listitems=function(options){
	var options=$.extend(true,{
		param:{},
		value:'',
		text:'',
		addition:null,
		callback:null
	},options);
	return $(this).each(function(){
		var target=$(this);
		target.empty();
		if (options.addition!=null)	target.append(options.addition);
		kintone.api(kintone.api.url('/k/v1/records',true),'GET',options.param,function(resp){
			$.data(target[0],'datasource',resp.records);
			$.each(resp.records,function(index){
				target.append(
					$('<option>')
					.attr('value',resp.records[index][options.value].value)
					.text(resp.records[index][options.text].value)
				);
			});
			if (options.callback!=null) options.callback();
		},function(error){});
	});
}
jTis.fn.mergetable=function(options){
	var MergeTable=function(options){
		var options=$.extend(true,{
			container:null,
			table:null,
			head:null,
			foot:null,
			template:null,
			dragclass:'drag',
			merge:false,
			mergeexclude:[],
			mergeclass:'merge',
			mergetrigger:null,
			unmergetrigger:null,
			callback:{
				guidestart:null,
				guide:null,
				guideend:null
			}
		},options);
		/* property */
		this.container=options.table;
		this.head=$('<thead>').append(options.head);
		this.contents=$('<tbody>');
		this.foot=(options.foot)?$('<tfoot>').append(options.foot):null;
		this.lastrow=null;
		this.template=options.template;
		this.dragclass=options.dragclass;
		this.mergeclass=options.mergeclass;
		this.dragenabled=true;
		/* append elements */
		this.container.append(this.head);
		this.container.append(this.contents);
		if (this.foot) this.container.append(this.foot);
		if (options.container!=null) options.container.append(this.container);
		/* initialize valiable */
		this.rows=this.contents.children('tr');
		/* valiable */
		var my=this;
		var container=this.container;
		var contents=this.contents;
		var merged=false;
		var mergerow=-1;
		var mergestart=-1;
		var mergefrom=-1;
		var mergeto=-1;
		var mergelimitfrom=-1;
		var mergelimitto=-1;
		/* events of merge */
		container.off('mousedown.merge touchstart.merge').on('mousedown.merge touchstart.merge','td',function(e){
			if (!options.merge) return;
			if (!my.dragenabled) return;
			var row=$(this).parent();
			var rowindex=contents.find('tr').index(row);
			var cellindex=row.find('td').index($(this));
			if (options.mergeexclude.indexOf(my.cellindex(row,cellindex))==-1)
			{
				/* merge start */
				merged=false;
				mergerow=rowindex;
				mergestart=cellindex;
				mergefrom=cellindex;
				mergeto=cellindex;
				for (var i=cellindex;i>-1;i--)
				{
					if (row.find('td').eq(i).hasClass(options.mergeclass)) break;
					mergelimitfrom=i;
				}
				for (var i=cellindex;i<row.find('td').length;i++)
				{
					if (row.find('td').eq(i).hasClass(options.mergeclass)) break;
					mergelimitto=i;
				}
				if (!$(this).hasClass(options.mergeclass)) $(this).addClass(options.dragclass);
				else merged=true;
				if (options.callback.guidestart!=null) options.callback.guidestart(e,my,container,mergerow,mergefrom);
				e.preventDefault();
			}
		});
		$(window).off('mousemove.merge touchmove.merge').on('mousemove.merge touchmove.merge',function(e){
			if (!options.merge) return;
			if (!my.dragenabled) return;
			/* return except during merge */
			if (mergerow==-1)
			{
				var hitrow=null;
				var hitcell=null;
				$.each(contents.find('tr'),function(){
					var row=$(this);
					if (row.offset().top<e.pageY && row.offset().top+row.outerHeight(true)>e.pageY)
					{
						hitrow=row;
						$.each(hitrow.find('td:visible'),function(){
							var cell=$(this);
							if (cell.offset().left<e.pageX && cell.offset().left+cell.outerWidth(true)>e.pageX) hitcell=cell;
						});
					}
				});
				if (options.callback.guidestart!=null)
				{
					if (hitcell!=null)
					{
						if (options.mergeexclude.indexOf(my.cellindex(hitrow,hitrow.find('td').index(hitcell)))==-1)
						{
							options.callback.guidestart(e,my,container,contents.find('tr').index(hitrow),hitrow.find('td').index(hitcell));
						}
						else options.callback.guidestart(e,my,container,null,null);
					}
					else options.callback.guidestart(e,my,container,null,null);
				}
				return;
			}
			/* get hover cell */
			var posX=(e.type=='touchmove')?e.originalEvent.touches[0].pageX:e.pageX;
			var hit=-1;
			for (var i=mergelimitfrom;i<mergelimitto+1;i++)
			{
				var cell=contents.find('tr').eq(mergerow).find('td').eq(i);
				if (cell.offset().left<posX && cell.offset().left+cell.outerWidth(true)>posX) hit=i;
			}
			if (hit==-1) return;
			if (mergestart>hit)
			{
				mergefrom=hit;
				mergeto=mergestart;
			}
			else
			{
				mergefrom=mergestart;
				mergeto=hit;
			}
			/* print merge range */
			for (var i=mergelimitfrom;i<mergelimitto+1;i++)
			{
				var cell=contents.find('tr').eq(mergerow).find('td').eq(i);
				if (i>mergefrom-1 && i<mergeto+1) cell.addClass(options.dragclass);
				else cell.removeClass(options.dragclass);
			}
			if (options.callback.guide!=null) options.callback.guide(e,my,container,mergerow,mergefrom,mergeto);
			e.preventDefault();
		});
		$(window).off('mouseup.merge touchend.merge').on('mouseup.merge touchend.merge',function(e){
			if (!options.merge) return;
			if (!my.dragenabled) return;
			/* return except during merge */
			if (mergerow==-1) return;
			var cell=contents.find('tr').eq(mergerow).find('td').eq(mergefrom);
			if (!merged)
			{
				if (options.mergetrigger!=null)
					options.mergetrigger(
						my,
						cell,
						mergerow,
						mergefrom,
						mergeto
					);
			}
			else
			{
				if (options.unmergetrigger!=null)
					options.unmergetrigger(
						my,
						cell,
						mergerow,
						mergefrom
					);
			}
			/* merge end */
			merged=false;
			mergerow=-1;
			mergestart=-1;
			mergefrom=-1;
			mergeto=-1;
			mergelimitfrom=-1;
			mergelimitto=-1;
			if (options.callback.guideend!=null) options.callback.guideend(e);
			e.preventDefault();
		});
	};
	MergeTable.prototype={
		/* get cell index */
		cellindex:function(row,cellindex){
			var colspan=0;
			var cells=$('td',row);
			var count=cells.length;
			for (var i=0;i<count;i++)
			{
				var cell=$(cells[i]);
				if (i<cellindex)
				{
					if (parseInt('0'+cell.attr('colspan'))!=0) colspan+=parseInt('0'+cell.attr('colspan'))-1;
				}
				else break;
			}
			return cellindex+colspan;
		},
		/* get merged cell index */
		mergecellindex:function(row,cellindex){
			var colspan=0;
			var res=0;
			var cells=$('td',row);
			var count=cells.length;
			for (var i=0;i<count;i++)
			{
				var cell=$(cells[i]);
				if (parseInt('0'+cell.attr('colspan'))!=0) colspan+=parseInt('0'+cell.attr('colspan'));
				else colspan++;
				if (!cell.hasClass('hide')) res=i;
				if (colspan>cellindex) {colspan=res;break;}
			}
			return colspan;
		},
		/* rows clear */
		clearrows:function(){
			this.contents.empty();
			/* initialize valiable */
			this.rows=this.contents.children('tr');
			this.lastrow=null;
		},
		/* row insert */
		insertrow:function(row,callback){
			var target=this.template.clone(true);
			if (row==null)
			{
				if (this.lastrow) target.insertAfter(this.lastrow);
				else this.contents.append(target);
				this.lastrow=target;
			}
			else
			{
				if (this.contents.find('tr').index(row)==this.contents.find('tr').length-1)
				{
					target.insertAfter(this.lastrow);
					this.lastrow=target;
				}
				else target.insertAfter(row);
			}
			/* initialize valiable */
			this.rows=this.contents.children('tr');
			if (callback!=null) callback(target);
		},
		/* row delete */
		deleterow:function(row){
			var index=this.rows.index(row);
			row.remove();
			/* initialize valiable */
			this.rows=this.contents.children('tr');
			this.lastrow=(this.rows.length!=0)?this.rows.last():null;
		},
		/* mearge cell */
		mergecell:function(cell,from,to){
			var colspan=to-from+1;
			var cells=$('td',cell.parent());
			for (var i=from;i<to;i++)
			{
				if (cells.eq(i+1).hasClass('hide')) colspan--;
				else cells.eq(i+1).remove();
			}
			cell.attr('colspan',colspan);
			cell.addClass(this.mergeclass);
			cell.removeClass(this.dragclass);
		},
		/* unmearge cell */
		unmergecell:function(cell){
			var colspan=parseInt('0'+cell.attr('colspan'));
			cell.removeAttr('colspan');
			for (var i=0;i<colspan-1;i++) $('<td>').insertAfter(cell);
			cell.removeClass(this.mergeclass);
			cell.removeClass(this.dragclass);
		}
	};
	return new MergeTable($.extend(true,{
		container:null,
		table:$(this),
		head:null,
		template:null,
		merge:false,
		mergeexclude:[],
		mergeclass:'merge',
		mergetrigger:null,
		unmergetrigger:null,
		callback:{
			guidestart:null,
			guide:null,
			guideend:null
		}
	},options));
};
jTis.fn.multiselect=function(options){
	var MultiSelect=function(options){
		var options=$.extend(true,{
			container:null,
			ismulticells:false
		},options);
		/* valiable */
		var my=this;
		/* property */
		this.ismulticells=options.ismulticells;
		this.dialog=createdialog('standard',600,500);
		this.contents=this.dialog.contents;
		this.selection={};
		/* append elements */
		this.dialog.contents.append(this.dialog.lists);
		this.dialog.container.append(this.dialog.contents);
		this.dialog.container.append(
			this.dialog.footer
			.append(button.clone(true).attr('id','ok').text('OK'))
			.append(button.clone(true).attr('id','cancel').text('Cancel'))
		);
		this.dialog.cover.append(this.dialog.container);
		options.container.append(this.dialog.cover);
		/* create template */
		if (!this.ismulticells)
			this.template=$('<tr>')
			.append(
				cell.clone(true).css({'padding':'5px'})
				.append($('<span>'))
				.append($('<input type="hidden">'))
				.on('click',function(){
					if ($(this).find('input').val() in my.selection)
					{
						$(this).css({'background-color':'transparent'});
						delete my.selection[$(this).find('input').val()];
					}
					else
					{
						$(this).css({'background-color':'#a0d8ef'});
						my.selection[$(this).find('input').val()]=$(this).find('span').text();
					}
				})
			)
			.on('mouseover',function(e){$(this).css({'background-color':'#f5b2b2'});})
			.on('mouseout',function(e){$(this).css({'background-color':'transparent'});});
	};
	MultiSelect.prototype={
		/* display referer */
		show:function(options){
			var options=$.extend(true,{
				datasource:[],
				buttons:{},
				selected:[]
			},options);
			var my=this;
			var isshift=false;
			var latest={
				element:null,
				select:false
			};
			/* key events */
			$(document).off('keydown.multiselect').on('keydown.multiselect',function(e){
				var code=e.keyCode||e.which;
				if (code==16) isshift=true;
				$(document).off('keyup.multiselect').on('keyup.multiselect',function(e){
					isshift=false;
				});
			});
			/* buttons callback */
			$.each(options.buttons,function(key,values){
				if (my.dialog.footer.find('button#'+key).size())
					my.dialog.footer.find('button#'+key).off('click').on('click',function(){
						if (values!=null) values((my.ismulticells)?Object.values(my.selection):my.selection);
					});
			});
			/* create template */
			if (this.ismulticells)
			{
				this.template=$('<tr>').append($('<input type="hidden">'));
				$.each(options.datasource[0],function(key,values){
					var css={'padding':'5px'};
					if (!values.display) css['display']='none';
					my.template
					.append(
						cell.clone(true).css(css)
						.append($('<span>').addClass(key).css({'user-select':'none'}))
						.on('click',function(){
							var row=$(this).closest('tr');
							var rows=$('tr',my.dialog.lists.find('tbody'));
							var range=[];
							if (isshift)
							{
								var start=0;
								var end=-1;
								if (latest.element)
								{
									if (rows.index(latest.element)==rows.index(row)) range.push(row);
									else
									{
										if (rows.index(latest.element)<rows.index(row))
										{
											start=rows.index(latest.element);
											end=rows.index(row);
										}
										else
										{
											start=rows.index(row);
											end=rows.index(latest.element);
										}
									}
								}
								else range.push(row);
								for (var i=start;i<end+1;i++) range.push(rows.eq(i));
							}
							else range.push(row);
							for (var i=0;i<range.length;i++)
								(function(row){
									if (isshift && latest.element)
									{
										if (!latest.select)
										{
											$('td',row).css({'background-color':'transparent'});
											delete my.selection[$('input',row).val()];
										}
										else
										{
											$('td',row).css({'background-color':'#a0d8ef'});
											my.selection[$('input',row).val()]=$.extend(true,{},options.datasource[parseInt($('input',row).val())]);
										}
									}
									else
									{
										if ($('input',row).val() in my.selection)
										{
											$('td',row).css({'background-color':'transparent'});
											delete my.selection[$('input',row).val()];
										}
										else
										{
											$('td',row).css({'background-color':'#a0d8ef'});
											my.selection[$('input',row).val()]=$.extend(true,{},options.datasource[parseInt($('input',row).val())]);
										}
									}
								})(range[i])
							latest.element=row;
							latest.select=($('input',row).val() in my.selection);
						})
					)
					.on('mouseover',function(e){$(this).css({'background-color':'#f5b2b2'});})
					.on('mouseout',function(e){$(this).css({'background-color':'transparent'});});
				});
			}
			/* create lists */
			this.dialog.lists.find('tbody').empty();
			this.selection={};
			for (var i=0;i<options.datasource.length;i++)
			{
				var datas=options.datasource[i];
				var list=my.template.clone(true);
				if (!this.ismulticells)
				{
					$('span',list).html(datas.text);
					$('input[type=hidden]',list).val(datas.value);
					if ($.inArray(datas.value,options.selected)>-1)
					{
						$('td',list).css({'background-color':'#a0d8ef'});;
						my.selection[datas.value]=datas.text;
					}
					else $(this).css({'background-color':'transparent'});
				}
				else
				{
					$('input[type=hidden]',list).val(i);
					$.each(datas,function(key,values){
						$('span.'+key,list).html(values.value);
					});
					if ($.grep(options.selected,function(item,index){
						var exists=0;
						$.each(item,function(key,values){
							if (datas[key].value==values) exists++;
						});
						return Object.keys(item).length==exists;
					}).length!=0)
					{
						$('td',list).css({'background-color':'#a0d8ef'});;
						my.selection[i]=$.extend(true,{},datas);
					}
					else $(this).css({'background-color':'transparent'});
				}
				my.dialog.lists.find('tbody').append(list);
			}
			this.dialog.cover.show();
		},
		/* hide referer */
		hide:function(){
			this.dialog.cover.hide();
		},
		/* redisplay referer */
		unhide:function(){
			this.dialog.cover.show();
		}
	};
	return new MultiSelect($.extend(true,{
		container:$(this),
		ismulticells:false
	},options));
};
jTis.fn.recordbrowser=function(options){
	var RecordBrowser=function(options){
		var options=$.extend(true,{
			container:null
		},options);
		var my=this;
		/* property */
		this.dialog=createdialog('dark');
		this.dialog.contents
		.append(
			$('<pre>').addClass('block').css({
				'background-color':'rgba(255,255,255,0.85)',
				'box-sizing':'border-box',
				'height':'100%',
				'overflow-x':'hidden',
				'overflow-y':'auto',
				'margin':'0px',
				'padding':'0.5em',
				'text-align':'left',
				'width':'100%'
			})
		);
		options.container.append(
			this.dialog.cover.append(
				this.dialog.container
				.append(
					this.dialog.header
					.append(
						this.dialog.button.clone(true)
						.attr('src','https://tis2010.jp/library/kintone/images/browse_close.svg')
						.on('click',function(){
							my.hide();
						})
					)
				)
				.append(this.dialog.contents)
			)
		);
	};
	RecordBrowser.prototype={
		/* show form */
		show:function(record,fieldinfos){
			var my=this;
			var fieldvalue=function(field){
				var res=null;
				switch (field.type.toUpperCase())
				{
					case 'CREATOR':
					case 'MODIFIER':
						res=field.value.name;
						break;
					case 'FILE':
					case 'GROUP_SELECT':
					case 'ORGANIZATION_SELECT':
					case 'STATUS_ASSIGNEE':
					case 'USER_SELECT':
						if (field.value.length!=0)
						{
							var values=[];
							$.each(field.value,function(index){
								values.push(field.value[index].name);
							});
							res=values;
						}
						else res=[];
						break;
					default:
						res=field.value;
						break;
				}
				return res;
			};
			$('.block',this.dialog.contents).html((function(record,fieldinfos){
				var res={};
				for (var key in record)
				{
					var field=record[key];
					/* check field type */
					switch (field.type)
					{
						case 'SUBTABLE':
							var tablecode=key;
							res[tablecode]=[];
							for (var i=0;i<field.value.length;i++)
							{
								var cells={};
								$.each(field.value[i].value,function(key,values){
									cells[(key in fieldinfos)?fieldinfos[key].label:'不明']=fieldvalue(values);
								});
								res[tablecode].push(cells);
							}
							break;
						default:
							res[(key in fieldinfos)?fieldinfos[key].label:'不明']=fieldvalue(field);
							break;
					}
				}
				return JSON.stringify(res,null,'\t');
			})(record,fieldinfos));
			this.dialog.cover.show();
		},
		/* hide form */
		hide:function(){
			this.dialog.cover.hide();
		}
	};
	return new RecordBrowser($.extend(true,{container:$(this)},options));
};
jTis.fn.referer=function(options){
	var Referer=function(options){
		var options=$.extend(true,{
			container:null,
			datasource:null,
			displaytext:[],
			searches:[],
			searchinfo:{
				app:'',
				query:'',
				sort:'',
				fieldinfos:{}
			}
		},options);
		/* valiable */
		var my=this;
		/* property */
		this.limit=50;
		this.offset=0;
		this.datasource=(options.datasource!=null)?options.datasource:[];
		this.displaytext=options.displaytext;
		this.searches=options.searches;
		this.searchinfo=options.searchinfo;
		this.dialog=createdialog('standard');
		this.contents=this.dialog.contents;
		this.searchblock=this.dialog.header
		this.callback=null;
		this.cursor={
			id:'',
			total:0
		};
		this.dialog.container.addClass('tis-referer-container');
		this.dialog.contents.addClass('tis-referer-contents');
		this.dialog.header.addClass('tis-referer-header');
		this.dialog.footer.addClass('tis-referer-footer');
		/* append elements */
		if (this.searches.length!=0)
		{
			$.each(this.searches,function(index){
				var searchvalue=$.extend(true,{
					id:'',
					label:'',
					type:'',
					param:{},
					value:'',
					text:'',
					callback:null
				},my.searches[index]);
				var searchfield=null;
				switch (searchvalue.type)
				{
					case 'select':
						searchfield=select.clone(true).attr('id',searchvalue.id);
						searchfield.listitems({
							param:searchvalue.param,
							value:searchvalue.value,
							text:searchvalue.text,
							addition:$('<option value="">'+((searchvalue.label)?searchvalue.label:'')+'</option')
						});
						$.data(searchfield[0],'searchtype','single');
						$('.main',my.dialog.header).append(searchfield.css({'width':'100%'}));
						break;
					case 'multi':
						searchfield=textline.clone(true).attr('id',searchvalue.id);
						if (searchvalue.label) searchfield.attr('placeholder',searchvalue.label);
						$.data(searchfield[0],'searchtype','multi');
						$('.main',my.dialog.header).append(searchfield.css({'margin-right':'-30px','padding-right':'35px'}));
						$('.main',my.dialog.header).append(
							button.clone(true)
							.css({
								'cursor':'pointer',
								'display':'inline-block',
								'margin':'0px',
								'padding':'0px',
								'vertical-align':'top',
								'width':'30px'
							})
							.append($('<img src="https://tis2010.jp/library/kintone/images/search.png" class="add" alt="絞り込み" title="絞り込み">').css({'width':'100%'}))
							.on('focus',function(e){
								$(e.currentTarget).css({'background-color':'#a0d8ef'});
							})
							.on('blur',function(e){
								$(e.currentTarget).css({'background-color':'transparent'});
							})
							.on('click',function(){
								/* reload referer */
								my.offset=0;
								if (my.searchinfo.app)
								{
									$.cursordelete(my.cursor.id,function(){
										my.cursor={
											id:'',
											total:0
										};
										my.datasource=[];
										my.search();
									});
								}
								else my.search();
							})
						);
						break;
				}
				if (searchvalue.callback!=null) searchfield.on('change',function(){searchvalue.callback(searchfield);});
			});
			$('input[type=text],select',this.dialog.header).on('keydown',function(e){
				var code=e.keyCode||e.which;
				if (code==13)
				{
					var targets=my.dialog.container.find('button,input[type=text],select,table');
					var total=targets.length;
					var index=targets.index(this);
					if (e.shiftKey)
					{
						if (index==0) index=total;
						index--;
					}
					else
					{
						index++;
						if (index==total) index=0;
					}
					targets.eq(index).focus();
					return false;
				}
			});
			if (this.searchinfo.app)
			{
				$('.main',this.dialog.header).css({'width':'calc(100% - 60px)'});
				$('.sub',this.dialog.header).css({'width':'60px'})
				.append(
					button.clone(true).addClass('prev')
					.css({
						'display':'inline-block',
						'margin':'0px',
						'padding':'0px',
						'width':'30px'
					})
					.append(
						$('<img>').css({'width':'100%'})
						.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAFMN540AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAN9JREFUeNpiYCAa/AcCrBIAAURYCxNB/QABRLK5Cv+hAJ+i+yTZCRBAVERAawNgbBYcgcgIDxmoxH5aRAEWABBAgxjB4oxojwLVrf+PBZBiowHZmtGjnOrxAxBAwx0BwyuBXI3vSQ5t9LgmReN5QomEBYsmASD1nhgLmGgVuucpSttA9Q7UyBjvKcoYZCcSmgCAABtFQ7aoEYDVFvSyrJ8qNQuRFjb8xwOobVkBLFcTAoTMYiG2WQCkFKjpCaKKXEZGRkUgBjXVCoH4w0CnYPrFMZ5UPZ/uFg9YPh4FxAIA/Qp+Mf/2/ocAAAAASUVORK5CYII=')
					)
					.on('click',function(){
						/* reload referer */
						my.offset-=(my.searchinfo.app)?1:my.limit;
						my.search();
					})
				)
				.append(
					button.clone(true).addClass('next')
					.css({
						'display':'inline-block',
						'margin':'0px',
						'padding':'0px',
						'width':'30px'
					})
					.append(
						$('<img>').css({'width':'100%'})
						.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAFMN540AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANRJREFUeNpiYCAa/AcCrBIAAYRTeQCGfiDYj1U1QACRhqBG/aeWWyEAIICo5DB0MSYsLleA8Rmx6WQEAgydQPAAJkEZAAigQYb+I8B9SjQjg/XkajYg1eYAmoYNQAANozhOoDSBvKc0dZEWvzgSyHlcahlJKIMEgfn4A84ygpo5iqCzCWl2oGtUJQz+pAwQYKNoUFYf64FYYKDqLRjop4sj/uMHDQNlMQy8B+ICYs1kJNZiEt0Kaisp4lNAzSIXVJYXMkKA4rCL4/n0TNX0z8ejgBoAAKp+fTuOFvwRAAAAAElFTkSuQmCC')
					)
					.on('click',function(){
						/* reload referer */
						my.offset+=(my.searchinfo.app)?1:my.limit;
						my.search();
					})
				);
			}
		}
		this.dialog.contents.append(this.dialog.lists);
		this.dialog.container.append(this.dialog.contents);
		if (this.searches.length!=0)
		{
			this.dialog.contents.css({'padding-top':'10px'})
			this.dialog.container.append(this.dialog.header);
		}
		this.dialog.container.append(
			this.dialog.footer
			.append(button.clone(true).attr('id','cancel').text('Cancel'))
		);
		this.dialog.cover.append(this.dialog.container.css({'padding-top':((this.searches.length!=0)?'40px':'5px')}));
		options.container.append(this.dialog.cover);
		/* create template */
		this.template=$('<tr>')
		.on('mouseover',function(e){$(this).css({'background-color':'#f5b2b2'});})
		.on('mouseout',function(e){$(this).css({'background-color':'transparent'});})
		.on('click',function(){if (my.callback!=null) my.callback($(this));});
		$.each(this.displaytext,function(index){
			my.template
			.append(cell.clone(true).css({'padding':'5px'}));
		});
		this.head=$('<tr>');
		if (this.dialog.lists.find('thead').size()) this.dialog.lists.find('thead').remove();
		if (this.searchinfo.app)
		{
			kintone.api(kintone.api.url('/k/v1/app/form/fields',true),'GET',{app:this.searchinfo.app},function(resp){
				$.each(my.displaytext,function(index){
					my.head
					.append(
						cell.clone(true).css({
							'background-color':'#EFEFEF',
							'cursor':'auto',
							'padding':'5px',
							'text-align':'center',
							'white-space':'nowrap'
						})
						.text(resp.properties[my.displaytext[index]].label)
					);
				});
				my.dialog.lists.prepend($('<thead>').append(my.head))
			},function(error){
				alert(error.message);
			});
		}
	};
	Referer.prototype={
		/* reload referer */
		search:function(callback){
			var my=this;
			var filter=[];
			var createlists=function(records){
				my.dialog.lists.find('tbody').empty();
				for (var i=0;i<records.length;i++)
				{
					var record=records[i];
					var list=my.template.clone(true);
					$.each(record,function(key,values){
						list.append($('<input type="hidden" id="'+key+'">').val(values.value));
					});
					$.each(my.displaytext,function(index){
						list.find('td').eq(index).html($.fieldvalue(record[my.displaytext[index]]));
					});
					my.dialog.lists.find('tbody').append(list);
				}
				if (callback) callback();
			}
			var setupmovebutton=function(){
				if (my.offset==0) $('.prev',my.dialog.header).prop('disabled',true).css({'opacity':'0.5'});
				else $('.prev',my.dialog.header).prop('disabled',false).css({'opacity':'1'});
				if ((my.offset+1)*my.limit>my.cursor.total-1) $('.next',my.dialog.header).prop('disabled',true).css({'opacity':'0.5'});
				else $('.next',my.dialog.header).prop('disabled',false).css({'opacity':'1'});
			};
			if (this.searchinfo.app)
			{
				if (this.datasource.length==0 && this.offset==0)
				{
					$.cursorcreate({
						app:this.searchinfo.app,
						query:(function(query){
							var res=(query)?query:'';
							var queries=[];
							if (my.searches.length!=0)
							{
								var searches=my.dialog.header.find('input[type=text],select');
								$.each(searches,function(index){
									var searchesvalue=($(this).val())?$(this).val():'';
									if (searchesvalue)
									{
										switch ($.data($(this)[0],'searchtype'))
										{
											case 'multi':
												var patterns=searchesvalue.replace(/[ 　]+/g,' ').split(' ');
												$.each(patterns,function(index){
													var pattern=patterns[index];
													$.each(my.displaytext,function(index){
														var fieldinfo=my.searchinfo.fieldinfos[my.displaytext[index]];
														switch (fieldinfo.type)
														{
															case 'LINK':
															case 'SINGLE_LINE_TEXT':
																queries.push($.fieldcompquery(fieldinfo,'2',pattern));
																break;
															case 'MULTI_LINE_TEXT':
															case 'RICH_TEXT':
																queries.push($.fieldcompquery(fieldinfo,'0',pattern));
																break;
														}
													});
												});
												break;
											case 'single':
												queries.push($.fieldcompquery(my.searchinfo.fieldinfos[$(this).attr('id')],'0',searchesvalue));
												break;
										}
									}
								});
							}
							if (queries.length!=0)
							{
								if (res) res+=' and ';
								res+='('+queries.join(' or ')+')';
							}
							return res;
						})(this.searchinfo.query),
						sort:((this.searchinfo.sort)?this.searchinfo.sort:'$id asc'),
						size:this.limit
					},function(id,total,error){
						if (error) alert(error);
						else
						{
							my.cursor.id=id;
							my.cursor.total=total;
							$.cursorfetch(my.cursor.id,false,function(records,error){
								if (error) alert(error);
								else
								{
									my.datasource.push(records);
									createlists(my.datasource[my.offset]);
									setupmovebutton();
								}
							});
						}
					});
				}
				else
				{
					if (this.datasource.length<this.offset+1)
					{
						$.cursorfetch(my.cursor.id,false,function(records,error){
							if (error) alert(error);
							else
							{
								my.datasource.push(records);
								createlists(my.datasource[my.offset]);
								setupmovebutton();
							}
						});
					}
					else
					{
						createlists(this.datasource[this.offset]);
						setupmovebutton();
					}
				}
			}
			else
			{
				if (this.searches.length!=0)
				{
					var searches=this.dialog.header.find('input[type=text],select');
					filter=$.grep(this.datasource,function(item,index){
						var exists=0;
						$.each(searches,function(index){
							var searchesvalue=($(this).val())?$(this).val():'';
							if (!searchesvalue) exists++;
							else
							{
								var checker=0;
								switch ($.data($(this)[0],'searchtype'))
								{
									case 'multi':
										var pattern=searchesvalue.replace(/[ 　]+/g,' ');
										var patterns=pattern.split(' ');
										pattern='';
										$.each(patterns,function(index){
											pattern+='(?=.*'+patterns[index]+')';
										});
										$.each(item,function(key,values){
											if (values.value) checker+=(values.value.toString().match(new RegExp('(^'+pattern.replace(/[\/\\^$*+?.()|\[\]{}]/g,'\\$&')+')+','ig'))!=null)?1:0;
										});
										break;
									case 'single':
										checker+=(item[$(this).attr('id')].value==searchesvalue)?1:0;
										break;
								}
								exists+=(checker!=0)?1:0;
							}
						});
						return searches.length==exists;
					});
				}
				else filter=this.datasource;
				/* create lists */
				createlists(filter);
			}
		},
		/* display referer */
		show:function(options){
			var options=$.extend(true,{
				buttons:{},
				callback:null
			},options);
			var my=this;
			/* buttons callback */
			$.each(options.buttons,function(key,values){
				if (my.dialog.footer.find('button#'+key).size())
					my.dialog.footer.find('button#'+key).off('click').on('click',function(){if (values!=null) values();});
			});
			/* lists callback */
			this.callback=options.callback;
			/* reload referer */
			this.offset=0;
			if (this.searchinfo.app) this.datasource=[];
			this.search(function(){
				my.dialog.cover.show();
				/* focus in search field */
				var searches=my.dialog.header.find('input[type=text],select');
				if (searches.length!=0) searches.eq(0).focus();
			});
		},
		/* hide referer */
		hide:function(){
			var my=this;
			if (this.cursor.id)
				$.cursordelete(this.cursor.id,function(){
					my.cursor={
						id:'',
						total:0
					};
				});
			this.dialog.cover.hide();
		},
		/* redisplay referer */
		unhide:function(){
			this.dialog.cover.show();
		}
	};
	return new Referer($.extend(true,{
		container:$(this),
		datasource:null,
		displaytext:[],
		searches:[],
		searchinfo:{
			app:'',
			query:'',
			sort:'',
			fieldinfos:{}
		}
	},options));
};
jTis.fn.routemap=function(apiikey,isfullscreen,needroute,loadedcallback,isreload,clickcallback,markerclickcallback){
	var RouteMap=function(options){
		var options=$.extend(true,{
			apiikey:'',
			container:null,
			isfullscreen:true,
			needroute:true,
			loadedcallback:null,
			clickcallback:null,
			markerclickcallback:null,
			isreload:false
		},options);
		/* valiable */
		var my=this;
		var div=$('<div>').css({
			'box-sizing':'border-box',
			'position':'relative'
		});
		/* keep parameters */
		this.isfullscreen=options.isfullscreen;
		this.needroute=options.needroute;
		this.loadedcallback=options.loadedcallback;
		this.clickcallback=options.clickcallback;
		this.markerclickcallback=options.markerclickcallback;
		/* loading wait */
		var waitgoogle=function(callback){
			setTimeout(function(){
				if (typeof(google)=='undefined') waitgoogle(callback);
				else callback();
			},1000);
		};
		/* append elements */
		this.container=div.clone(true).css({
			'background-color':'#FFFFFF',
			'height':'100%',
			'width':'100%'
		}).attr('id','mapcontainer');
		if (this.isfullscreen)
		{
			this.container.css({
				'bottom':'-100%',
				'left':'0px',
				'max-height':'100vh',
				'max-width':'100vw',
				'position':'fixed',
				'z-index':'999999'
			});
		}
		this.contents=div.clone(true).css({
			'height':'100%',
			'left':'0px',
			'position':'absolute',
			'top':'0px',
			'width':'100%',
			'z-index':'1'
		}).attr('id','mapcontents');
		this.buttonblock=div.clone(true).css({
			'background-color':'transparent',
			'display':'inline-block',
			'padding':'5px',
			'position':'absolute',
			'right':'0px',
			'text-align':'right',
			'top':'0px',
			'white-space':'nowrap',
			'width':'auto',
			'z-index':'2'
		}).append(
			$('<button id="mapclose">')
			.css({
				'background-color':'transparent',
				'border':'none',
				'height':'48px',
				'padding':'0px',
				'width':'48px'
			})
			.on('click',function(){
				my.container.css({'bottom':'-100%'});
			})
			.append($('<img src="https://tis2010.jp/library/kintone/images/close.svg" alt="閉じる" title="閉じる" />').css({'width':'100%'}))
		);
		this.container.append(this.contents);
		if (this.isfullscreen) this.container.append(this.buttonblock);
		if (options.container) options.container.append(this.container);
		/* setup google map */
		if (!options.isreload)
		{
			var api=$('<script>');
			api.attr('type','text/javascript');
			api.attr('src','https://maps.googleapis.com/maps/api/js?key='+options.apiikey);
			$('head').append(api);
		}
		/* setup map */
		this.colors=$.markercolors();
		this.currentlatlng=null;
		this.watchId=null;
		this.markers=[];
		this.balloons=[];
		this.map=null;
		this.directionsRenderer=null;
		this.directionsService=null;
		this.geocoder=null;
		this.loaded=false;
		/* loading wait */
		if (options.container) waitgoogle(function(){
			var latlng=new google.maps.LatLng(0,0);
			var param={
				center:latlng,
				fullscreenControl:true,
				fullscreenControlOptions:{position:google.maps.ControlPosition.BOTTOM_LEFT},
				gestureHandling:((my.isfullscreen)?'greedy':'auto'),
				mapTypeControl:true,
				mapTypeControlOptions:{
					style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
					position:google.maps.ControlPosition.TOP_LEFT
				},
				overviewMapControl:false,
				panControl:true,
				scaleControl:false,
				streetViewControl:true,
				zoomControl:true,
				zoom:(($(window).width()>1024)?14:21-Math.ceil($(window).width()/250))
			};
			my.map=new google.maps.Map(document.getElementById(my.contents.attr('id')),param);
			my.directionsRenderer=new google.maps.DirectionsRenderer({suppressMarkers:true});
			my.directionsService=new google.maps.DirectionsService();
			my.geocoder=new google.maps.Geocoder();
			if (my.loadedcallback) google.maps.event.addListener(my.map,'idle',function(){if (!my.loaded) my.loadedcallback();my.loaded=true;});
			if (my.clickcallback)
			{
				google.maps.event.addListener(my.map,'click',function(e){
					my.inaddress({
						lat:e.latLng.lat(),
						lng:e.latLng.lng(),
						callback:function(result){
							my.clickcallback(result,e.latLng);
						}
					})
				});
			}
		});
	};
	RouteMap.prototype={
		/* close information widnow */
		closeinfowindow:function(){
			var my=this;
			$.each(this.balloons,function(index){
				my.balloons[index].close();
			});
		},
		/* get currentlocation */
		currentlocation:function(options){
			var options=$.extend(true,{
				callback:null
			},options);
			if (navigator.geolocation)
			{
				var userAgent=window.navigator.userAgent.toLowerCase();
				if (userAgent.indexOf('msie')!=-1 || userAgent.indexOf('trident')!=-1) alert('Internet Explorerでは正常に動作しません。\nMicrosoft Edgeかその他のブラウザを利用して下さい。');
				if (this.watchID) options.callback(this.currentlatlng);
				else
				{
					var watchparam={
						accuracy:Number.MAX_SAFE_INTEGER,
						counter:0,
						latlng:null,
						limit:5
					};
					var watch=function(param,callback){
						var watchID=navigator.geolocation.watchPosition(
							function(pos){
								if (param.accuracy>pos.coords.accuracy)
								{
									param.accuracy=pos.coords.accuracy;
									param.latlng=new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
								}
								param.counter++;
								if (watchparam.counter>watchparam.limit-1 && callback) callback(param.latlng);
								navigator.geolocation.clearWatch(watchID);
							},
							function(error){
								switch (error.code)
								{
									case 1:
										alert('位置情報取得のアクセスが拒否されました。\n'+error.message);
										break;
									case 2:
										alert('位置情報の取得に失敗しました。\n'+error.message);
										break;
								}
								param.counter++;
								if (param.latlng)
									if (watchparam.counter>watchparam.limit-1 && callback) callback(param.latlng);
								navigator.geolocation.clearWatch(watchID);
							},
							{
								enableHighAccuracy:true,
								maximumAge:0,
								timeout:10000
							}
						);
					};
					for (var i=0;i<watchparam.limit;i++) watch(watchparam,options.callback);
				}
			}
			else {alert('お使いのブラウザでは位置情報が取得出来ません。');}
		},
		/* open information widnow */
		openinfowindow:function(){
			var my=this;
			$.each(this.balloons,function(index){
				if (my.markers.length>index) my.balloons[index].open(my.map,my.markers[index]);
			});
		},
		/* reload map */
		reloadmap:function(options){
			var options=$.extend(true,{
				markers:[],
				isopeninfowindow:true,
				callback:null
			},options);
			var my=this;
			var colors=this.colors;
			var map=this.map;
			var renderer=this.directionsRenderer;
			var service=this.directionsService;
			var serialnumber=0;
			var markers=[];
			var balloons=[];
			/* initialize markers */
			$.each(this.markers,function(index,values){values.setMap(null);values=null;});
			this.markers=[];
			markers=this.markers;
			/* initialize balloons */
			$.each(this.balloons,function(index,values){values.setMap(null);values=null;});
			this.balloons=[];
			balloons=this.balloons;
			/* initialize renderer */
			renderer.setMap(null);
			var addmarker=function(markeroptions,infowindowoptions,index){
				/* append markers */
				var markeroptions=$.extend(true,{
					color:0,
					fontsize:11,
					icon:null,
					label:'',
					latlng:new google.maps.LatLng(0,0),
					size:34
				},markeroptions);
				var infowindowoptions=$.extend(true,{
					label:'',
				},infowindowoptions);
				var marker=new google.maps.Marker({
					map:map,
					position:markeroptions.latlng
				});
				if (markeroptions.icon) marker.setIcon(markeroptions.icon);
				else
				{
					marker.setIcon({
						anchor:new google.maps.Point(17,34),
						fillColor:'#'+((markeroptions.color in colors)?colors[markeroptions.color].back:markeroptions.color),
						fillOpacity:1,
						labelOrigin:new google.maps.Point(17,11),
						path:'M26.837,9.837C26.837,17.765,17,19.89,17,34 c0-14.11-9.837-16.235-9.837-24.163C7.163,4.404,11.567,0,17,0C22.432,0,26.837,4.404,26.837,9.837z',
						scale:markeroptions.size/34,
						strokeColor:"#696969",
					});
				}
				if (markeroptions.label.length!=0)
					marker.setLabel({
						color:'#'+((markeroptions.color in colors)?colors[markeroptions.color].fore:'000000'),
						text:markeroptions.label.toString(),
						fontSize:markeroptions.fontsize+'px',
					});
				if (my.markerclickcallback)
				{
					google.maps.event.addListener(marker,'click',function(e){
						my.markerclickcallback(index);
					});
				}
				markers.push(marker);
				/* append balloons */
				if (infowindowoptions.label.length!=0)
				{
					var balloon=new google.maps.InfoWindow({content:infowindowoptions.label,disableAutoPan:true});
					if (options.isopeninfowindow) balloon.open(map,marker);
					if (my.markerclickcallback==null)
						google.maps.event.addListener(marker,'click',function(event){
							if (!balloon.getMap()) balloon.open(map,marker);
						});
					balloons.push(balloon);
				}
			};
			switch (options.markers.length)
			{
				case 0:
					break;
				case 1:
					/* append markers */
					var values=$.extend(true,{
						colors:0,
						fontsize:11,
						icon:null,
						label:'',
						lat:0,
						lng:0,
						size:34,
						serialnumber:true
					},options.markers[0]);
					addmarker(
						{
							color:values.colors,
							fontsize:values.fontsize,
							icon:values.icon,
							label:((values.serialnumber)?'1':''),
							latlng:new google.maps.LatLng(values.lat,values.lng),
							size:values.size
						},
						{
							label:values.label
						},
						0
					);
					/* setup center position */
					map.setCenter(new google.maps.LatLng(values.lat,values.lng));
					if (options.callback) options.callback();
					break;
				default:
					if (this.needroute)
					{
						/* setup routes */
						var origin=null;
						var destination=null;
						var waypoints=[];
						var labels=[];
						$.each(options.markers,function(index,values){
							var values=$.extend(true,{
								label:'',
								lat:0,
								lng:0
							},values);
							switch (index)
							{
								case 0:
									origin=new google.maps.LatLng(values.lat,values.lng);
									break;
								case options.markers.length-1:
									destination=new google.maps.LatLng(values.lat,values.lng);
									break;
								default:
									waypoints.push({
										location:new google.maps.LatLng(values.lat,values.lng),
										stopover:true
									});
									break;
							}
							labels.push((values.label.length!=0)?values.label:'');
						});
						/* setup center position */
						map.setCenter(new google.maps.LatLng(options.markers[0].lat,options.markers[0].lng));
						/* display routes */
						service.route({
							origin:origin,
							destination:destination,
							waypoints:waypoints,
							travelMode:google.maps.TravelMode.DRIVING
						},
						function(result,status){
							if (status==google.maps.DirectionsStatus.OK)
							{
								/* append markers */
								serialnumber=0;
								$.each(options.markers,function(index,values){
									var values=$.extend(true,{
										colors:0,
										fontsize:11,
										icon:null,
										label:'',
										lat:0,
										lng:0,
										size:34,
										serialnumber:true
									},values);
									if (values.serialnumber) serialnumber++;
									addmarker(
										{
											color:values.colors,
											fontsize:values.fontsize,
											icon:values.icon,
											label:((values.serialnumber)?serialnumber.toString():''),
											latlng:new google.maps.LatLng(values.lat,values.lng),
											size:values.size
										},
										{
											label:values.label
										},
										index
									);
								});
								renderer.setDirections(result);
								renderer.setMap(map);
								if (options.callback) options.callback();
							}
						});
					}
					else
					{
						/* append markers */
						serialnumber=0;
						$.each(options.markers,function(index,values){
							var values=$.extend(true,{
								colors:0,
								fontsize:11,
								icon:null,
								label:'',
								lat:0,
								lng:0,
								size:34,
								serialnumber:true
							},values);
							if (values.serialnumber) serialnumber++;
							addmarker(
								{
									color:values.colors,
									fontsize:values.fontsize,
									icon:values.icon,
									label:((values.serialnumber)?serialnumber.toString():''),
									latlng:new google.maps.LatLng(values.lat,values.lng),
									size:values.size
								},
								{
									label:values.label
								},
								index
							);
						});
						/* setup center position */
						map.setCenter(new google.maps.LatLng(options.markers[0].lat,options.markers[0].lng));
						if (options.callback) options.callback();
					}
					break;
			}
			if (this.isfullscreen) this.container.css({'bottom':'0px'});
		},
		inaddress:function(options){
			var options=$.extend(true,{
				target:null,
				address:'',
				lat:0,
				lng:0,
				callback:null,
				fali:null
			},options);
			if (options.address)
			{
				this.geocoder.geocode({
					'address':options.address,
					'region': 'jp'
				},
				function(results,status){
					switch (status)
					{
						case google.maps.GeocoderStatus.ZERO_RESULTS:
							if (options.fali) options.fali();
							break;
						case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
							alert('リクエストが割り当て量を超えています。');
							if (options.fali) options.fali();
							break;
						case google.maps.GeocoderStatus.REQUEST_DENIED:
							alert('リクエストが拒否されました。');
							if (options.fali) options.fali();
							break;
						case google.maps.GeocoderStatus.INVALID_REQUEST:
							alert('クエリが不足しています。');
							if (options.fali) options.fali();
							break;
						case 'OK':
							if (options.callback) options.callback(results[0]);
							break;
					}
				});
			}
			else
			{
				this.geocoder.geocode({
					'location':new google.maps.LatLng(options.lat,options.lng)
				},
				function(results,status){
					switch (status)
					{
						case google.maps.GeocoderStatus.ZERO_RESULTS:
							if (options.fali) options.fali();
							break;
						case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
							alert('リクエストが割り当て量を超えています。');
							if (options.fali) options.fali();
							break;
						case google.maps.GeocoderStatus.REQUEST_DENIED:
							alert('リクエストが拒否されました。');
							if (options.fali) options.fali();
							break;
						case google.maps.GeocoderStatus.INVALID_REQUEST:
							alert('クエリが不足しています。');
							if (options.fali) options.fali();
							break;
						case 'OK':
							if (options.target)
							{
								switch (options.target.prop('tagName').toLowerCase())
								{
									case 'input':
									case 'textarea':
										options.target.val(results[0].formatted_address.replace(/日本(,|、)[ ]*/g,''));
										break;
									default:
										options.target.text(results[0].formatted_address.replace(/日本(,|、)[ ]*/g,''));
										break;
								}
							}
							if (options.callback) options.callback(results[0]);
							break;
					}
				});
			}
		},
		inbounds:function(){
			var bounds=this.map.getBounds();
			return {
				north:bounds.getNorthEast().lat(),
				south:bounds.getSouthWest().lat(),
				east:bounds.getNorthEast().lng(),
				west:bounds.getSouthWest().lng()
			};
		},
		watchlocation:function(options){
			var options=$.extend(true,{
				callback:null
			},options);
			var my=this;
			if (navigator.geolocation)
			{
				var userAgent=window.navigator.userAgent.toLowerCase();
				if (userAgent.indexOf('msie')!=-1 || userAgent.indexOf('trident')!=-1) alert('Internet Explorerでは正常に動作しません。\nMicrosoft Edgeかその他のブラウザを利用して下さい。');
				this.watchID=navigator.geolocation.watchPosition(
					function(pos){
						my.currentlatlng=new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
						if (options.callback) options.callback(my.currentlatlng);
					},
					function(error){
						if (my.currentlatlng==null) my.currentlatlng=new google.maps.LatLng(0,0);
					},
					{
						enableHighAccuracy:true,
						maximumAge:0,
						timeout:10000
					}
				);
			}
			else {alert('お使いのブラウザでは位置情報が取得出来ません。');}
		},
		unwatchlocation:function(){
			if (navigator.geolocation) navigator.geolocation.clearWatch(this.watchID);
			this.watchID=null;
		}
	};
	return new RouteMap({
		apiikey:apiikey,
		container:$(this),
		isfullscreen:(isfullscreen===undefined)?true:isfullscreen,
		needroute:(needroute===undefined)?true:needroute,
		loadedcallback:(loadedcallback===undefined)?null:loadedcallback,
		clickcallback:(clickcallback===undefined)?null:clickcallback,
		markerclickcallback:(markerclickcallback===undefined)?null:markerclickcallback,
		isreload:(isreload===undefined)?false:isreload
	});
};
jTis.fn.termselect=function(options){
	var TermSelect=function(options){
		var options=$.extend(true,{
			container:null,
			minutespan:30,
			isadd:false,
			isdatepick:false,
			issingle:false,
			istimeonly:false
		},options);
		/* valiable */
		var my=this;
		var pluswidth=0;
		if (this.isadd) pluswidth+=60;
		/* property */
		this.isadd=options.isadd;
		this.isdatepick=options.isdatepick;
		this.issingle=options.issingle;
		this.istimeonly=options.istimeonly;
		this.dialog=createdialog('standard',500,(((!options.issingle)?545:365)+pluswidth));
		this.contents=this.dialog.contents;
		/* append elements */
		this.dialog.container.append(this.dialog.contents);
		this.dialog.container.append(
			this.dialog.footer
			.append(button.clone(true).attr('id','ok').text('OK'))
			.append(button.clone(true).attr('id','cancel').text('Cancel'))
		);
		this.dialog.cover.append(this.dialog.container);
		options.container.append(this.dialog.cover);
		/* create template */
		this.hour=select.clone(true);
		this.minute=select.clone(true);
		for (var i=0;i<60;i+=options.minutespan) this.minute.append($('<option>').attr('value',('0'+i.toString()).slice(-2)).text(('0'+i.toString()).slice(-2)))
		this.template=div.clone(true).addClass('term').css({
			'border-bottom':'1px dotted #C9C9C9',
			'padding':'5px 0px',
			'width':'100%'
		})
		.append(
			div.clone(true).css({
				'display':'inline-block',
				'min-height':'30px',
				'width':'150px'
			})
			.append(span.clone(true).addClass('date'))
		)
		.append(this.hour.clone(true).addClass('starthour'))
		.append(span.clone(true).text('：'))
		.append(this.minute.clone(true).addClass('startminute').val('00'))
		.append(span.clone(true).css({'display':((options.issingle)?'none':'inline-block')}).html('&nbsp;~&nbsp;'))
		.append(this.hour.clone(true).css({'display':((options.issingle)?'none':'inline-block')}).addClass('endhour'))
		.append(span.clone(true).css({'display':((options.issingle)?'none':'inline-block')}).text('：'))
		.append(this.minute.clone(true).css({'display':((options.issingle)?'none':'inline-block')}).addClass('endminute').val('00'));
		/* add row */
		if (options.isadd)
		{
			this.template
			.append(
				span.clone(true).css({'padding':'0px'})
				.append(
					$('<img src="https://tis2010.jp/library/kintone/images/add.png" class="add" alt="追加" title="追加">')
					.css({
						'cursor':'pointer',
						'vertical-align':'top',
						'width':'30px'
					})
					.on('click',function(){
						var row=my.template.clone(true);
						$('.del',row).show();
						my.dialog.contents.append(row);
					})
				)
			)
			.append(
				span.clone(true).css({'padding':'0px'})
				.append(
					$('<img src="https://tis2010.jp/library/kintone/images/close.png" class="del" alt="削除" title="削除">')
					.css({
						'cursor':'pointer',
						'display':'none',
						'vertical-align':'top',
						'width':'30px'
					})
					.on('click',function(){
						$(this).closest('.term').remove();
					})
				)
			);
		}
		/* day pickup */
		if (options.isdatepick && !options.istimeonly)
		{
			this.template.find('.date').closest('div').css({'padding-left':'30px'})
			.append(
				$('<img src="https://tis2010.jp/library/kintone/images/calendar.png" alt="カレンダー" title="カレンダー">')
				.css({
					'position':'absolute',
					'left':'0px',
					'top':'0px',
					'width':'30px'
				})
				.on('click',function(){
					activerow=$(this).closest('div');
					my.calendar.show({activedate:new Date($('.date',$(this).closest('div')).text().dateformat())});
				})
			);
		}
		/* day pickup */
		if (options.isdatepick && !options.istimeonly)
		{
			var activerow=null;
			this.calendar=$('body').calendar({
				selected:function(target,value){
					$('.date',activerow).text(value);
				}
			});
		}
	};
	TermSelect.prototype={
		/* display calendar */
		show:function(options){
			var options=$.extend(true,{
				fromhour:0,
				tohour:23,
				dates:[],
				starttimes:[],
				endtimes:[],
				buttons:{}
			},options);
			var my=this;
			/* buttons callback */
			$.each(options.buttons,function(key,values){
				if (my.dialog.footer.find('button#'+key).size())
					my.dialog.footer.find('button#'+key).off('click').on('click',function(){
						if (values!=null)
						{
							var date='';
							var starttime='';
							var endtime='';
							var times=0;
							var datetimes=[];
							$.each($('div.term',my.dialog.container),function(){
								var row=$(this);
								if ($('.date',row).text().length==0) return true;
								date=(!my.istimeonly)?$('.date',row).text():new Date().format('Y-m-d');
								starttime=$('.starthour',row).val()+':'+$('.startminute',row).val();
								endtime=$('.endhour',row).val()+':'+$('.endminute',row).val();
								if (!my.issingle)
								{
									if (parseInt(starttime)>parseInt(endtime))
									{
										starttime=$('.endhour',row).val()+':'+$('.endminute',row).val();
										endtime=$('.starthour',row).val()+':'+$('.startminute',row).val();
									}
									times=0;
									times+=new Date((date+'T'+endtime+':00'+$.timezome()).dateformat()).getTime();
									times-=new Date((date+'T'+starttime+':00'+$.timezome()).dateformat()).getTime();
								}
								datetimes.push({
									date:date,
									starttime:starttime,
									endtime:endtime,
									hours:times/(1000*60*60)
								});
							});
							values(datetimes);
						}
					});
			});
			this.dialog.contents.empty();
			$('.starthour',this.template).empty();
			$('.endhour',this.template).empty();
			for (var i=options.fromhour;i<options.tohour+1;i++)
			{
				$('.starthour',this.template).append($('<option>').attr('value',('0'+i.toString()).slice(-2)).text(('0'+i.toString()).slice(-2)));
				$('.endhour',this.template).append($('<option>').attr('value',('0'+i.toString()).slice(-2)).text(('0'+i.toString()).slice(-2)));
			}
			for (var i=0;i<options.dates.length;i++)
			{
				var row=this.template.clone(true);
				if (options.starttimes.length>i)
				{
					$('.starthour',row).val(options.starttimes[i].split(':')[0]);
					$('.startminute',row).val(options.starttimes[i].split(':')[1]);
				}
				else $('.starthour',row).val($('.starthour',row).find('option').first().val());
				if (options.endtimes.length>i)
				{
					$('.endhour',row).val(options.endtimes[i].split(':')[0]);
					$('.endminute',row).val(options.endtimes[i].split(':')[1]);
				}
				else $('.endhour',row).val($('.endhour',row).find('option').first().val());
				$('.date',row).text(options.dates[i]);
				this.dialog.contents.append(row);
			}
			if (this.isadd && options.dates.length==0) this.dialog.contents.append(this.template.clone(true));
			this.dialog.cover.show();
		},
		/* hide calendar */
		hide:function(){
			this.dialog.cover.hide();
		},
		/* redisplay referer */
		unhide:function(){
			this.dialog.cover.show();
		}
	};
	return new TermSelect($.extend(true,{
		container:$(this),
		minutespan:30,
		isdatepick:false,
		issingle:false,
		istimeonly:false
	},options));
};
jTis.fn.thumbnailbrowser=function(options){
	var ThumbnailBrowser=function(options){
		var options=$.extend(true,{
			container:null
		},options);
		var my=this;
		/* property */
		this.active=0;
		this.thumbnails=[];
		this.dialog=createdialog('dark');
		this.dialog.contents.css({
			'overflow':'hidden',
			'white-space':'nowrap'
		});
		this.move=function(){
			var pos=0;
			for (var i=0;i<my.thumbnails.length;i++)
			{
				pos+=100;
				if (i<my.active)
				{
					my.thumbnails[i].css({'transform':'translateX(-'+pos.toString()+'%)'});
					continue;
				}
				if (i>my.active)
				{
					my.thumbnails[i].css({'transform':'translateX('+pos.toString()+'%)'});
					continue;
				}
				pos-=100;
				my.thumbnails[i].css({'transform':'translateX(-'+pos.toString()+'%)'});
			}
		};
		options.container.append(
			this.dialog.cover.append(
				this.dialog.container
				.append(
					this.dialog.header
					.append(
						this.dialog.button.clone(true)
						.attr('src','https://tis2010.jp/library/kintone/images/browse_close.svg')
						.on('click',function(){
							my.hide();
						})
					)
				)
				.append(this.dialog.contents)
				.append(
					this.dialog.button.clone(true).css({
						'left':'0',
						'position':'absolute',
						'top':'50%',
						'-webkit-transform':'translate(0%,-50%)',
						'-ms-transform':'translate(0%,-50%)',
						'transform':'translate(0%,-50%)'
					})
					.attr('src','https://tis2010.jp/library/kintone/images/browse_prev.svg')
					.on('click',function(){
						if (my.active>0) my.active--;
						my.move();
					})
				)
				.append(
					this.dialog.button.clone(true).css({
						'position':'absolute',
						'right':'0',
						'top':'50%',
						'-webkit-transform':'translate(0%,-50%)',
						'-ms-transform':'translate(0%,-50%)',
						'transform':'translate(0%,-50%)'
					})
					.attr('src','https://tis2010.jp/library/kintone/images/browse_next.svg')
					.on('click',function(){
						if (my.active<my.thumbnails.length-1) my.active++;
						my.move();
					})
				)
			)
		);
	};
	ThumbnailBrowser.prototype={
		/* show form */
		show:function(attachments,active,callback){
			var my=this;
			var setup=function(index){
				var attachment=attachments[index];
				(function(attachment,container){
					my.thumbnails.push(container);
					my.dialog.contents.append(container);
					$.download(attachment.fileKey).then(function(blob){
						var url=window.URL || window.webkitURL;
						container.append(
							$('<img>').css({
								'box-sizing':'border-box',
								'display':'block',
								'left':'50%',
								'max-height':'calc(100% - 2em)',
								'max-width':'calc(100% - 2em)',
								'position':'absolute',
								'top':'50%',
								'-webkit-transform':'translate(-50%,-50%)',
								'-ms-transform':'translate(-50%,-50%)',
								'transform':'translate(-50%,-50%)'
							})
							.attr('src',url.createObjectURL(blob))
							.on('click',function(){
								if (callback) callback(attachment);
							})
						);
					});
				})(attachment,div.clone(true).css({
					'display':'inline-block',
					'height':'100%',
					'transition':'all 0.35s ease-out 0s',
					'width':'100%'
				}));
				index++;
				if (index<attachments.length) setup(index);
			}
			if (attachments.length!=0)
			{
				my.thumbnails=[];
				my.dialog.contents.empty();
				setup(0);
				my.dialog.cover.show();
				my.active=active;
				my.move();
			}
		},
		/* hide form */
		hide:function(){
			this.dialog.cover.hide();
		}
	};
	return new ThumbnailBrowser($.extend(true,{container:$(this)},options));
};
$('body').append($('<style>').attr('type','text/css').text((function(){
	var res='';
	res+='*.swalTis-overlay{z-index:1000000;}';
	return res;
})()));
kintone.events.on('app.record.index.show',function(event){
	if (localStorage.getItem('tis-plugins-installdate'))
	{
		var installdate=new Date(localStorage.getItem('tis-plugins-installdate').replace(/-/g,'/'));
		if (installdate.calc('1 month')<new Date())
		{
			var subdomain=window.location.host.split('.')[0];
			var displaydate=(localStorage.getItem('tis-plugins-displaydate-'+kintone.app.getId()))?localStorage.getItem('tis-plugins-displaydate-'+kintone.app.getId()):new Date().calc('-1 day').format('Y-m-d');
			if (!$('.tis-plugins-information-dialog').size())
				if (displaydate!=new Date().format('Y-m-d'))
				{
					var displaytime=null;
					if (localStorage.getItem('tis-plugins-displaytime-'+kintone.app.getId())) displaytime=parseInt(localStorage.getItem('tis-plugins-displaytime-'+kintone.app.getId()));
					else
					{
						var nowhour=new Date().getHours();
						displaytime=(nowhour<15)?(Math.floor(Math.random()*(15-nowhour))+nowhour):nowhour-1;
						localStorage.setItem('tis-plugins-displaytime-'+kintone.app.getId(),displaytime.toString());
					}
					if (new Date().getHours()>displaytime)
					{
						kintone.proxy(
							'https://propone.tis2010.jp/api/support/',
							'POST',
							{'X-Requested-With':'XMLHttpRequest'},
							{domain:subdomain},
							function(body,status,headers){
								var json=JSON.parse(body);
								switch (status)
								{
									case 200:
										if (json.support!='ok')
										{
											var div=$('<div>').css({
												'box-sizing':'border-box',
												'margin':'0px',
												'padding':'0px',
												'position':'relative',
												'vertical-align':'top'
											}).addClass('tis-plugins-information-dialog');
											var cover=div.clone(true).css({
												'background-color':'rgba(0,0,0,0.5)',
												'height':'100%',
												'left':'0px',
												'position':'fixed',
												'top':'0px',
												'width':'100%',
												'z-index':'99999999'
											});
											var container=div.clone(true).css({
												'background-color':'#FFFFFF',
												'bottom':'0',
												'border-radius':'5px',
												'box-shadow':'0px 0px 3px rgba(0,0,0,0.35)',
												'height':'575px',
												'left':'0',
												'margin':'auto',
												'max-height':'calc(100% - 1em)',
												'max-width':'calc(100% - 1em)',
												'padding':'5px',
												'position':'absolute',
												'right':'0',
												'text-align':'center',
												'top':'0',
												'width':'600px'
											});
											var contents=div.clone(true).css({
												'height':'100%',
												'margin':'0px',
												'overflow-x':'hidden',
												'overflow-y':'auto',
												'padding':'5px',
												'position':'relative',
												'text-align':'center',
												'width':'100%',
												'z-index':'1'
											});
											contents
											.append(
												$('<h2>')
												.css({'font-size':'1.5em','font-weight':'normal'})
												.html('TISからのご連絡')
											)
											.append(
												$('<p>')
												.css({'line-height':'1.5em','padding':'0 2em'})
												.html('<p>現在ご利用中のTIS製プラグインの利用申請が行われておりません。<br>このまま利用し続けることも可能ですが、メッセージを非表示にしたい場合はサポートサイトよりプラグインの利用申請をお願い致します。</p><p>サポートサイトはこちら&nbsp;<a href="https://propone.tis2010.jp" target="_blank">https://propone.tis2010.jp</a></p>')
											)
											.append(
												$('<img>')
												.css({'max-width':'100%'})
												.attr('src','data:image/png;base64,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')
											)
											.append(
												$('<button>').css({
													'background-color':'#65AB31',
													'border':'none',
													'border-radius':'0.25em',
													'color':'#FFFFFF',
													'display':'block',
													'line-height':'3em',
													'margin':'0 auto',
													'margin-top':'1em',
													'min-width':'8.25em',
													'outline':'none',
													'padding':'0px 0.5em',
													'text-align':'center'
												}).html('閉じる').on('click',function(e){
													cover.hide();
												})
											);
											$('body').append(cover.append(container.append(contents)));
										}
										break;
									default:
										console.log(json.error);
										break;
								}
							},
							function(error){
								console.log(error);
							}
						);
						localStorage.setItem('tis-plugins-displaydate-'+kintone.app.getId(),new Date().format('Y-m-d'));
						localStorage.removeItem('tis-plugins-displaytime-'+kintone.app.getId());
					}
				}
		}
	}
	else localStorage.setItem('tis-plugins-installdate',new Date().format('Y-m-d'));
	return event;
});
})(jTis);
