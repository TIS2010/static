/*
* TIS-Plugin "tis.js"
* Version: 1.0
* Copyright (c) 2018 TIS
* Released under the MIT License.
* http://tis2010.jp/license.txt
*/
"use strict";
class tislibrary{
	/* constructor */
	constructor(){
		/* setup properties */
		this.window={
			alert:null,
			loader:null,
			addresspicker:null,
			coloradjuster:null,
			colorpicker:null,
			datepicker:null,
			multipicker:null,
			recordpicker:null,
			panelizer:null,
			resourcemanager:null
		}
		this.eventlisteners={};
	}
	/* show coloradjuster */
	adjustcolor(color,callback){
		this.window.coloradjuster.show(color,callback);
	}
	/* show alert */
	alert(message,callback){
		this.loadend();
		this.window.alert.alert(message,callback);
	}
	/* assign record */
	assignrecord(container,group,record){
		container.elms('[data-group='+group+']').some((item,index) => {
			var hasid=item.hasAttribute('id');
			var hasdataname=item.hasAttribute('data-name');
			var hasname=item.hasAttribute('name');
			var assignvalue=(item,value) => {
				if (item.hasAttribute('data-padding'))
				{
					var param=item.attr('data-padding').split(':');
					if (param.length==3)
					{
						if (value===undefined || value===null) value='';
						if (param[2]=='L') value=value.toString().lpad(param[0],param[1]);
						else  value=value.toString().rpad(param[0],param[1]);
					}
				}
				if (item.hasAttribute('data-type'))
				{
					switch (item.attr('data-type'))
					{
						case 'date':
						case 'datetime':
							if (value) value=value;
							break;
						case 'number':
							if (tis.isnumeric(value))
								value=Number(value).comma(item.attr('data-digit'));
							break;
						case 'postalcode':
							if (value)
							{
								var postalcode=value.replace(/[^0-9]+/g,'');
								if (postalcode.length==7) value=postalcode.substr(0,3)+'-'+postalcode.substr(3,4);
							}
							break;
					}
				}
				switch (item.tagName.toLowerCase())
				{
					case 'p':
					case 'span':
						item.html(value);
						break;
					default:
						item.val(value);
						break;
				}
			};
			/* setup elements */
			switch (item.tagName.toLowerCase())
			{
				case 'input':
					switch (item.type.toLowerCase())
					{
						case 'checkbox':
							if (hasid)
								if (item.attr('id') in record)
									item.checked=(record[item.attr('id')]=='1')?true:false;
							break;
						case 'radio':
							if (hasdataname)
							{
								if (item.attr('data-name') in record)
									container.elms('[data-name='+item.attr('data-name')+']').some((item,index) => {
										item.checked=(record[item.attr('data-name')]==item.val());
									});
							}
							else
							{
								if (hasname)
									if (item.attr('name') in record)
										container.elms('[name='+item.attr('name')+']').some((item,index) => {
											if (record[item.attr('name')]==item.val()) item.checked=true;
										});
							}
							break;
						default:
							if (hasid)
								if (item.attr('id') in record) assignvalue(item,record[item.attr('id')]);
							break;
					}
					break;
				default:
					if (hasid)
						if (item.attr('id') in record) assignvalue(item,record[item.attr('id')]);
					break;
			}
		});
	}
	/* build record */
	buildrecord(container,group){
		var res={
			error:false,
			record:{}
		};
		container.elms('[data-group='+group+']').some((item,index) => {
			var hasid=item.hasAttribute('id');
			var hasdataname=item.hasAttribute('data-name');
			var hasname=item.hasAttribute('name');
			/* validation */
			switch (item.tagName.toLowerCase())
			{
				case 'p':
				case 'span':
					break;
				default:
					if (!item.checkValidity()) res.error=true;
					break;
			}
			if (!res.error)
			{
				/* setup record */
				switch (item.tagName.toLowerCase())
				{
					case 'input':
						switch (item.type.toLowerCase())
						{
							case 'checkbox':
								if (hasid) res.record[item.attr('id')]=(item.checked)?'1':'0';
								break;
							case 'radio':
								if (hasdataname)
								{
									container.elms('[data-name='+item.attr('data-name')+']').some((item,index) => {
										if (item.checked) res.record[item.attr('data-name')]=item.val();
									});
								}
								else
								{
									if (hasname)
										container.elms('[name='+item.attr('name')+']').some((item,index) => {
											if (item.checked) res.record[item.attr('name')]=item.val();
										});
								}
								break;
							default:
								if (hasid) res.record[item.attr('id')]=item.val();
								break;
						}
						break;
					case 'p':
					case 'span':
						break;
					default:
						if (hasid) res.record[item.attr('id')]=item.val();
						break;
				}
			}
		});
		if (res.error) this.alert('入力内容に誤りがあります');
		return res;
	}
	/* calculate tax */
	calculatetax(normal,reduced,free,date,outside,taxround){
		var freeprice=0;
		var normalprice=0;
		var normaltax=0;
		var reducedprice=0;
		var reducedtax=0;
		var taxrate=this.taxrate(date);
		if (outside)
		{
			//outside
			switch (taxround)
			{
				case 'floor':
					normalprice=Math.floor(normal*(1+taxrate.normalrate));
					normaltax=Math.floor((normalprice*taxrate.normalrate*100)/(100+(taxrate.normalrate*100)));
					reducedprice=Math.floor(reduced*(1+taxrate.reducedrate));
					reducedtax=Math.floor((reducedprice*taxrate.reducedrate*100)/(100+(taxrate.reducedrate*100)));
					break;
				case 'ceil':
					normalprice=Math.ceil(normal*(1+taxrate.normalrate));
					normaltax=Math.ceil((normalprice*taxrate.normalrate*100)/(100+(taxrate.normalrate*100)));
					reducedprice=Math.ceil(reduced*(1+taxrate.reducedrate));
					reducedtax=Math.ceil((reducedprice*taxrate.reducedrate*100)/(100+(taxrate.reducedrate*100)));
					break;
				case 'round':
					normalprice=Math.round(normal*(1+taxrate.normalrate));
					normaltax=Math.round((normalprice*taxrate.normalrate*100)/(100+(taxrate.normalrate*100)));
					reducedprice=Math.round(reduced*(1+taxrate.reducedrate));
					reducedtax=Math.round((reducedprice*taxrate.reducedrate*100)/(100+(taxrate.reducedrate*100)));
					break;
			}
		}
		else
		{
			//inside
			switch (taxround)
			{
				case 'floor':
					normalprice=Math.floor(normal);
					normaltax=Math.floor((normalprice*taxrate.normalrate*100)/(100+(taxrate.normalrate*100)));
					reducedprice=Math.floor(reduced);
					reducedtax=Math.floor((reducedprice*taxrate.reducedrate*100)/(100+(taxrate.reducedrate*100)));
					break;
				case 'ceil':
					normalprice=Math.ceil(normal);
					normaltax=Math.ceil((normalprice*taxrate.normalrate*100)/(100+(taxrate.normalrate*100)));
					reducedprice=Math.ceil(reduced);
					reducedtax=Math.ceil((reducedprice*taxrate.reducedrate*100)/(100+(taxrate.reducedrate*100)));
					break;
				case 'round':
					normalprice=Math.round(normal);
					normaltax=Math.round((normalprice*taxrate.normalrate*100)/(100+(taxrate.normalrate*100)));
					reducedprice=Math.round(reduced);
					reducedtax=Math.round((reducedprice*taxrate.reducedrate*100)/(100+(taxrate.reducedrate*100)));
					break;
			}
		}
		switch (taxround)
		{
			case 'floor':
				freeprice=Math.floor(free);
				break;
			case 'ceil':
				freeprice=Math.ceil(free);
				break;
			case 'round':
				freeprice=Math.round(free);
				break;
		}
		return {
			subtotal:normalprice-normaltax+reducedprice-reducedtax+freeprice,
			tax:normaltax+reducedtax,
			total:normalprice+reducedprice+freeprice,
			normaltotal:normalprice-normaltax+freeprice,
			reducedtotal:reducedprice-reducedtax,
			normaltax:normaltax,
			reducedtax:reducedtax
		}
	}
	/* get children */
	children(element){
		return Array.from(element.children);
	}
	/* copy to clipboard */
	clipboard(value){
		var input=tis.create('input').attr('type','text').val(value);
		tis.elm('body').append(input);
		input.select();
		document.execCommand('copy');
		document.body.removeChild(input);
	}
	/* show confirm */
	confirm(message,callback,usecancel){
		this.loadend();
		this.window.alert.confirm(message,callback,usecancel);
	}
	/* create element */
	create(tagname){
		return document.createElement(tagname);
	}
	/* check device */
	device(){
		var ua=navigator.userAgent;
		if (ua.indexOf('iPhone')>0 || ua.indexOf('iPod')>0 || ua.indexOf('Android')>0 && ua.indexOf('Mobile')>0 || ua.indexOf('Windows Phone')>0) return 'sp';
		if (ua.indexOf('iPad')>0 || ua.indexOf('Android')>0) return 'tab';
		return 'other';
	}
	/* download text file */
	downloadtext(values,filename){
		var blob=new Blob([new Uint8Array([0xEF,0xBB,0xBF]),values],{type:'text/plain'});
		if (window.navigator.msSaveBlob) window.navigator.msSaveOrOpenBlob(blob,filename);
		else
		{
			var url=window.URL || window.webkitURL;
			var a=tis.create('a')
			.attr('href',url.createObjectURL(blob))
			.attr('target','_blank')
			.attr('download',filename)
			.css({display:'none'});
			tis.elm('body').append(a);
			a.click();
			document.body.removeChild(a);
		}
	}
	/* get elements */
	elm(selectors){
		return document.querySelector(selectors);
	}
	elms(selectors){
		return Array.from(document.querySelectorAll(selectors));
	}
	/* send file request */
	file(url,method,headers,body,silent=false){
		return new Promise((resolve,reject) => {
			var filedata=new FormData();
			var xhr=new XMLHttpRequest();
			var param=[];
			switch (method)
			{
				case 'GET':
					for (var key in body)
					{
						if (body[key] instanceof Object) param.push(key+'='+JSON.stringify(body[key]));
						else param.push(key+'='+body[key]);
					}
					break;
				case 'POST':
					for (var key in body)
					{
						switch (key)
						{
							case 'files':
								for (var i=0;i<body[key].length;i++)
								{
									var blob=new Blob([body[key][i]],{type:body[key][i].type});
									filedata.append('file[]',blob,body[key][i].name);
								}
								break;
							default:
								if (body[key] instanceof Object) param.push(key+'='+JSON.stringify(body[key]));
								else param.push(key+'='+body[key]);
								break;
						}
					}
					if (!body.name)	param.push('name='+'file');
					break;
			}
			if (param.length!=0) url+='?'+param.join('&');
			xhr.open(method,url,true);
			for (var key in headers) xhr.setRequestHeader(key,headers[key]);
			xhr.onload=(e) => {
				if (!silent) this.loadend();
				switch (e.currentTarget.status)
				{
					case 200:
						resolve(e.currentTarget.response);
						break;
					default:
						reject({message:e.currentTarget.responseText,status:e.currentTarget.status});
						break;
				}
			}
			xhr.onerror=(e) => {
				var message=(e.currentTarget.responseText)?e.currentTarget.responseText:'The requested URL '+url+' was not found.';
				if (!silent) this.loadend();
				reject({message:message,status:e.currentTarget.status});
			}
			if (!silent) this.loadstart();
			if (method=='POST') xhr.send(filedata);
			else
			{
				if (typeof body!=='string') xhr.send(JSON.stringify(body));
				else xhr.send(body);
			}
		});
	}
	/* create graph */
	graph(canvas,type,scale,captions,styles,values){
		return new tisgraph(canvas,type,scale,captions,styles,values);
	}
	/* show input */
	input(message,callback,type,defaults){
		this.loadend();
		this.window.alert.input(message,callback,type,defaults);
	}
	/* check number */
	isnumeric(value){
		if (typeof value==='string') return value.match(/^-?[0-9]+(\.[0-9]+)*$/g);
		if (typeof value==='number') return true;
		return false;
	}
	/* hide loader */
	loadend(){
		this.window.loader.hide();
	}
	/* show loader */
	loadstart(){
		this.window.loader.show();
	}
	/* show panelizer */
	panelize(elements){
		this.window.panelizer.show(elements);
	}
	/* show addresspicker */
	pickupaddress(prefecture,city,callback){
		this.window.addresspicker.show(prefecture,city,callback);
	}
	/* show colorpicker */
	pickupcolor(callback){
		this.window.colorpicker.show(callback);
	}
	/* show datepicker */
	pickupdate(activedate,callback){
		this.window.datepicker.show(activedate,callback);
	}
	/* show multipicker */
	pickupmultiple(records,columninfos,callback,selected){
		this.window.multipicker.show(records,columninfos,callback,selected);
	}
	/* show recordpicker */
	pickuprecord(records,columninfos,callback){
		this.window.recordpicker.show(records,columninfos,callback);
	}
	/* get phonetic */
	phonetic(text,callback){
		this.request('https://tis2010.jp/service/api/phonetic','POST',{'X-Requested-With':'XMLHttpRequest'},{text:text},true)
		.then((resp) => {
			if (callback) callback(JSON.parse(resp).response);
		})
		.catch((error) => this.alert(error.message));
	}
	/* get query strings */
	queries(){
		var res={};
		var searches=decodeURI(window.location.search).split('?');
		if (searches.length>1)
		{
			searches=searches.last().replace(/#.*$/g,'').split('&');
			for(var i=0;i<searches.length;i++)
			{
				var search=searches[i].split('=');
				res[search[0]]=search[1];
			}
		}
		return res;
	}
	/* document loaded */
	ready(callback){
		document.on('DOMContentLoaded',(e) => {
			if (!this.window.alert)
			{
				/* setup properties */
				this.window.resourcemanager=new tisresourcemanager();
				this.window.panelizer=new tispanelizer();
				this.window.recordpicker=new tisrecordpicker();
				this.window.multipicker=new tismultipicker();
				this.window.datepicker=new tisdatepicker();
				this.window.colorpicker=new tiscolorpicker();
				this.window.coloradjuster=new tiscoloradjuster();
				this.window.addresspicker=new tisaddresspicker();
				this.window.loader=new tisloader();
				this.window.alert=new tisalert();
				/* setup validation method */
				tis.elms('input,select,textarea').some((item,index) => {
					item.initialize();
				});
				/* create map */
				this.map=new tismap();
			}
			if (callback) callback(this);
		});
	}
	/* send request */
	request(url,method,headers,body,silent=false,addcontenttype=true){
		return new Promise((resolve,reject) => {
			var xhr=new XMLHttpRequest();
			var param=[];
			if (method=='GET')
			{
				for (var key in body)
				{
					if (body[key] instanceof Object) param.push(key+'='+JSON.stringify(body[key]));
					else param.push(key+'='+body[key]);
				}
			}
			if (param.length!=0) url+='?'+param.join('&');
			xhr.open(method,url,true);
			for (var key in headers) xhr.setRequestHeader(key,headers[key]);
			if (addcontenttype)
				if (!('Content-Type' in headers)) xhr.setRequestHeader('Content-Type','application/json');
			xhr.onload=(e) => {
				if (!silent) this.loadend();
				switch (e.currentTarget.status)
				{
					case 200:
						resolve(e.currentTarget.response);
						break;
					default:
						try
						{
							var json=JSON.parse(e.currentTarget.responseText);
							var message='';
							if ('message' in json) message=json.message;
							else
							{
								if ('error' in json) message=json.error.message;
							}
							reject({message:message,status:e.currentTarget.status});
						}
						catch(error)
						{
							reject({message:e.currentTarget.responseText,status:e.currentTarget.status});
						}
						break;
				}
			}
			xhr.onerror=(e) => {
				var message=(e.currentTarget.responseText)?e.currentTarget.responseText:'The requested URL '+url+' was not found.';
				if (!silent) this.loadend();
				reject({message:message,status:e.currentTarget.status});
			}
			if (!silent) this.loadstart();
			if (typeof body!=='string') xhr.send(JSON.stringify(body));
			else xhr.send(body);
		});
	}
	/* show resourcemanager */
	resourcemanager(url,directory,callback){
		this.window.resourcemanager.show(url,directory,callback);
	}
	/* get tax rate */
	taxrate(date){
		var tax=[
			{startdate:'1900-01-01',normalrate:0,reducedrate:0},
			{startdate:'1989-04-01',normalrate:0.03,reducedrate:0.03},
			{startdate:'1997-04-01',normalrate:0.05,reducedrate:0.05},
			{startdate:'2014-04-01',normalrate:0.08,reducedrate:0.08},
			{startdate:'2019-10-01',normalrate:0.1,reducedrate:0.08}
		];
		var res={};
		var today=new Date().format('Y/m/d');
		for (var i=0;i<tax.length;i++) if (new Date(tax[i].startdate.replace(/-/g,'\/'))<new Date((date)?date.replace(/-/g,'\/'):today)) res=tax[i];
		return res;
	}
	/* scroll to element */
	scroll(pos,duration){
		var counter=0;
		var keep=performance.now();
		var param=(window.pageYOffset-pos)/2;
		var step=(timestamp) => {
			var diff=timestamp-keep;
			if (diff>100) diff=30;
			counter+=Math.PI/(duration/diff);
			if (counter>=Math.PI) return;
			window.scrollTo(0,Math.round(pos+param+param*Math.cos(counter)));
			keep=timestamp;
			window.requestAnimationFrame(step);
		}
		window.requestAnimationFrame(step);
	}
	scrollTo(pos,duration){
		this.scroll(window.pageYOffset+pos,duration);
	}
	scrollTop(duration){
		this.scroll(0,duration);
	}
};
class tisalert{
	/* constructor */
	constructor(){
		var button=tis.create('button');
		var div=tis.create('div');
		var active=(e) => e.currentTarget.css({fontWeight:'bold'});
		var passive=(e) => e.currentTarget.css({fontWeight:'normal'});
		/* initialize valiable */
		button.css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			color:'#42a5f5',
			cursor:'pointer',
			display:'inline-block',
			fontSize:'1em',
			lineHeight:'2.5em',
			margin:'0px',
			outline:'none',
			padding:'0px 0.5em',
			position:'relative',
			textAlign:'center',
			verticalAlign:'top'
		});
		div.css({
			boxSizing:'border-box',
			position:'relative'
		});
		/* setup properties */
		this.listener=null;
		this.cover=div.clone().css({
			backgroundColor:'rgba(0,0,0,0.5)',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999999'
		});
		this.container=div.clone().css({
			backgroundColor:'#ffffff',
			borderRadius:'0.5em',
			boxShadow:'0px 0px 3px rgba(0,0,0,0.35)',
			left:'50%',
			maxHeight:'calc(100% - 1em)',
			maxWidth:'calc(100% - 1em)',
			minWidth:'10em',
			padding:'1em 0px 3.5em 0px',
			position:'absolute',
			top:'50%',
			transform:'translate(-50%,-50%)'
		});
		this.contents=div.clone().css({
			lineHeight:'1.5em',
			overflowX:'hidden',
			overflowY:'auto',
			padding:'0px 1em',
			textAlign:'center',
			width:'100%'
		});
		this.prompt=tis.create('input').css({
			backgroundColor:'transparent',
			border:'1px solid #42a5f5',
			borderRadius:'0.25em',
			boxSizing:'border-box',
			display:'inline-block',
			fontSize:'1em',
			height:'2em',
			lineHeight:'1.5em',
			margin:'0.25em 0px',
			outline:'none',
			padding:'0.5em 0.25em',
			position:'relative',
			verticalAlign:'top',
			width:'100%'
		})
		.attr('type','password')
		.on('keydown',(e) => {
			var code=e.keyCode||e.which;
			if (code==13)
			{
				this.ok.focus();
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		});
		this.buttons=div.clone().css({
			borderTop:'1px solid #42a5f5',
			bottom:'0px',
			left:'0px',
			position:'absolute',
			width:'100%'
		});
		this.ok=button.clone().html('OK')
		.on('mouseover',active)
		.on('mouseout',passive)
		.on('focus',active)
		.on('blur',passive);
		this.cancel=button.clone().html('Cancel')
		.on('mouseover',active)
		.on('mouseout',passive)
		.on('focus',active)
		.on('blur',passive)
		.on('click',(e) => this.cover.css({display:'none'}));
		/* append elements */
		tis.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(this.contents)
				.append(
					this.buttons
					.append(this.ok)
					.append(this.cancel)
				)
			)
		);
		/* resize event */
		window.on('resize',(e) => {
			this.contents
			.css({height:'auto'})
			.css({height:this.container.innerheight().toString()+'px'});
		});
	}
	/* show alert */
	alert(message,callback){
		/* setup listener */
		if (this.listener)
		{
			this.ok.off('click',this.listener);
			this.cancel.off('click',this.listener);
		}
		this.listener=(e) => {
			this.cover.css({display:'none'});
			if (callback) callback();
		};
		this.ok.on('click',this.listener);
		/* setup styles */
		this.ok.css({
			borderRight:'none',
			width:'100%'
		});
		this.cancel.css({display:'none'});
		/* setup message */
		if (message.nodeName) this.contents.empty().append(message);
		else this.contents.html(message);
		/* show */
		this.cover.css({display:'block'});
		this.contents
		.css({height:'auto'})
		.css({height:this.container.innerheight().toString()+'px'});
		this.ok.focus();
	}
	/* show confirm */
	confirm(message,callback,usecancel){
		/* setup listener */
		if (this.listener)
		{
			this.ok.off('click',this.listener);
			this.cancel.off('click',this.listener);
		}
		this.listener=(e) => {
			this.cover.css({display:'none'});
			if (callback) callback(e.currentTarget==this.ok);
		};
		this.ok.on('click',this.listener);
		if (usecancel) this.cancel.on('click',this.listener);
		/* setup styles */
		this.ok.css({
			borderRight:'1px solid #42a5f5',
			width:'50%'
		});
		this.cancel.css({
			display:'inline-block',
			width:'50%'
		});
		/* setup message */
		if (message.nodeName) this.contents.empty().append(message);
		else this.contents.html(message);
		/* show */
		this.cover.css({display:'block'});
		this.contents
		.css({height:'auto'})
		.css({height:this.container.innerheight().toString()+'px'});
		this.ok.focus();
	}
	/* show input */
	input(message,callback,type,defaults){
		/* setup listener */
		if (this.listener)
		{
			this.ok.off('click',this.listener);
			this.cancel.off('click',this.listener);
		}
		this.listener=(e) => {
			this.cover.css({display:'none'});
			if (callback) callback(this.prompt.val());
		};
		this.ok.on('click',this.listener);
		/* setup styles */
		this.ok.css({
			borderRight:'1px solid #42a5f5',
			width:'50%'
		});
		this.cancel.css({
			display:'inline-block',
			width:'50%'
		});
		/* setup message */
		if (message.nodeName) this.contents.empty().append(message);
		else this.contents.empty().append(tis.create('span').html(message));
		this.contents.append(this.prompt.attr('type',(type)?type:'password').val((defaults)?defaults:''))
		/* show */
		this.cover.css({display:'block'});
		this.contents
		.css({height:'auto'})
		.css({height:this.container.innerheight().toString()+'px'});
		this.ok.focus();
	}
};
class tisaddresspicker{
	/* constructor */
	constructor(){
		var div=tis.create('div');
		var select=tis.create('select');
		/* initialize valiable */
		div.css({
			boxSizing:'border-box',
			position:'relative'
		});
		select.css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			display:'inline-block',
			fontSize:'1em',
			height:'2em',
			lineHeight:'2em',
			margin:'0px',
			outline:'none',
			padding:'0px 2.5em 0px 0.5em',
			position:'relative',
			verticalAlign:'top',
			width:'100%',
			appearance:'none',
			mozAppearance:'none',
			webkitAppearance:'none'
		})
		/* setup properties */
		this.table=null;
		this.cover=div.clone().css({
			backgroundColor:'rgba(0,0,0,0.5)',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999997'
		});
		this.container=div.clone().css({
			backgroundColor:'#ffffff',
			borderRadius:'0.5em',
			boxShadow:'0px 0px 3px rgba(0,0,0,0.35)',
			height:'calc(33.5em + 16px)',
			left:'50%',
			maxHeight:'calc(100% - 1em)',
			maxWidth:'calc(100% - 1em)',
			padding:'calc(5em + 1px) 0px 0.5em 0px',
			position:'absolute',
			top:'50%',
			transform:'translate(-50%,-50%)',
			width:'20em'
		});
		this.contents=div.clone().css({
			height:'100%',
			overflowX:'hidden',
			overflowY:'auto',
			padding:'0px',
			textAlign:'center',
			width:'100%'
		});
		this.buttons=div.clone().css({
			borderBottom:'1px solid #42a5f5',
			left:'0px',
			padding:'0.25em 0px',
			position:'absolute',
			top:'0px',
			width:'100%'
		});
		this.close=tis.create('img').css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			cursor:'pointer',
			display:'block',
			height:'2em',
			margin:'0px',
			position:'absolute',
			right:'0.25em',
			top:'0.25em',
			width:'2em'
		})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9pJREFUeNpiYKAUMMIY/VMmvgdSAjB+YU4+WI4JSbFAQXYeA5KG/+gKGCZMncSArAhDAUyRm7MriCmI4gZkY0GSQDd8IMoXAAFEHf//RxL/ALRbkAldAuo1AQxvgSRA3kL3syDIn8gS6HaCjHqPHN54AUAAUceraMENdwISwAh6RmyaQJ7btXc3ik4kMbgh6CkAbBtMIyjoYEkGybD3OJMPephjS3M4/YyezNEAONqpEtoAATREEa5Egh5oWAMKW2j/x2UTeoJnwqYxMyUdRROMj24wzkQC04BuEDJgRrK1AUg5gNhnzp1lMDUyYbCxtGb4+/cvw/Q5M+EaPLw8GXdu23EAr80kA5CfQPjHjx9gjM4m2s8wpyI7mXZRhaTgA5bcxDh40jZAAI3mZmLToQMsF0DBAWBEHqC6xUCL1gOpABLM3QB0SCDZFpNhIdEOYMRjKUrhCSqJ2NnZGX7+/Ik1h+KRJ67QRYrD/biKRGQLCDkIChzR0wALDoUOhMol5BofvW2Ew7wDxBR8B/BVAiALQT4EWQiiQXx8lQI28wZXHA9oqh7QfEzLkmvkAYAAGkWjYNC1QAqQilNQkTiBZhZDG/31BJQ1Ah3RQBWLcXS5CQGCoyFMBCw1IMNScE8cqpc8i4HgPAXp5zxZFkPrY5ShAlERUZwGgeTQhxDQzSBoMTReMYYWosMjsVoOEgPJYQECULOI9vF6dIGlK5djtRzZUpgaQmbhsxijsff6zWsMy9EtBakhtuFIUv8a3XIiLCU7VWO1HHk0DMQm1VKyLAYFL3Q8FT4Ehy+1U8Vi9DjFleAosfgAIUtBwYstwRHbOcBlcSC2PIwtIaFbToxZOC2GFvAfsOVlbAkJ2XIsIy8fyOkf/6ekssc33EMocRlSYK/hoKyPB28LhFZtrlEw/AFAgPas6AZBIIZeiAM5gNG4gTH+KyM4gSPoBuq/MW5gNA7AJrCBXrEm98HJtQVE6Av9BO6l7bV91UehUHRfhQismlAxQfpcmi/St6chPZq3FJq1mjC2Bhvj35tzkGFPs2sFYRQ59taGDURkYi225JPGCWPIXhsiWkR8ygn5SBC66Y/IGvxviueo18Nlc4SrcMHm6XQ5kwQKmKwXs3m+ufqgZH8XPLOQCVuyK8xX0oFDiHPfQ0BeH+og/JR4qoiAkGjQ4M8diSFfttQU8BG6Pe5mMhqLibqcQ0rXgPBBVm2Fw8MG2SUO5uqBQqKk80WmZ6B4mNXmhYQ0GMiPQk9nemkJPZxf/1WXJV+OEz0ea+NRZS/NLVE1YE2dono3POh4qAJAxyQehUKh+Cu8AL45fzrg+n0KAAAAAElFTkSuQmCC')
		.on('click',(e) => this.hide());
		this.prefecture=select.clone()
		.on('change',(e) => this.pickupcity(this.prefecture.val()));
		this.city=select.clone()
		.on('change',(e) => this.pickupstreet(this.prefecture.val(),this.city.val()));
		/* append elements */
		tis.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(this.contents)
				.append(
					this.buttons
					.append(this.prefecture)
					.append(
						div.clone().css({
							backgroundColor:'#42a5f5',
							height:'1px',
							margin:'0.25em 0px',
							padding:'0px',
							width:'100%'
						})
					)
					.append(this.city)
					.append(this.close)
				)
			)
		);
	}
	/* search prefecture */
	pickupprefecture(callback){
		/* initialize elements */
		this.prefecture.empty()
		.append(
			tis.create('option')
			.attr('value','')
			.html('都道府県を選択')
		);
		this.city.empty()
		.append(
			tis.create('option')
			.attr('value','')
			.html('市区町村を選択')
		);
		if (this.table) this.table.clearrows();
		/* setup elements */
		tis.request('https://tis2010.jp/service/api/place/prefecture','GET',{'X-Requested-With':'XMLHttpRequest'},{},true)
		.then((resp) => {
			var records=JSON.parse(resp).records;
			this.prefecture.assignoption(records,'name','id');
			if (callback) callback(records);
		})
		.catch((error) => tis.alert(error.message));
	}
	/* search city */
	pickupcity(prefecture,callback){
		/* initialize elements */
		this.city.empty()
		.append(
			tis.create('option')
			.attr('value','')
			.html('市区町村を選択')
		);
		if (this.table) this.table.clearrows();
		/* setup elements */
		if (prefecture)
		{
			tis.request('https://tis2010.jp/service/api/place/city?prefecture='+prefecture,'GET',{'X-Requested-With':'XMLHttpRequest'},{},true)
			.then((resp) => {
				var records=JSON.parse(resp).records;
				this.city.assignoption(records,'name','id');
				if (callback) callback(records);
			})
			.catch((error) => tis.alert(error.message));
		}
		else
		{
			if (callback) callback();
		}
	}
	/* search street */
	pickupstreet(prefecture,city,callback){
		/* initialize elements */
		if (this.table) this.table.clearrows();
		/* setup elements */
		if (prefecture && city)
		{
			tis.request('https://tis2010.jp/service/api/place/street?prefecture='+prefecture+'&city='+city,'GET',{'X-Requested-With':'XMLHttpRequest'},{},true)
			.then((resp) => {
				var records=JSON.parse(resp).records;
				/* append records */
				if (this.table)
					for (var i=0;i<records.length;i++)
						this.table.addrow().elm('td').attr('id',records[i].id).html((records[i].name)?records[i].name:'&nbsp;');
				if (callback) callback(records);
			})
			.catch((error) => tis.alert(error.message));
		}
		else
		{
			if (callback) callback();
		}
	}
	/* search postalcode */
	pickupzip(zip,callback){
		tis.request('https://tis2010.jp/service/api/place/zip?search='+zip,'GET',{'X-Requested-With':'XMLHttpRequest'},{},true)
		.then((resp) => {
			if (callback) callback(JSON.parse(resp).records[0]);
		})
		.catch((error) => tis.alert(error.message));
	}
	/* show records */
	show(prefecture,city,callback){
		/* create table */
		this.table=tis.create('table').css({
			borderCollapse:'collapse',
			width:'100%'
		})
		.append(
			tis.create('tbody').append(
				tis.create('tr')
				.append(
					tis.create('td').css({
						border:'none',
						borderBottom:'1px solid #42a5f5',
						boxSizing:'border-box',
						cursor:'pointer',
						lineHeight:'1.5em',
						margin:'0px',
						padding:'0.25em 0.5em',
						textAlign:'left'
					})
				)
			)
		);
		this.contents.empty().append(
			this.table.spread((row,index) => {
				row.on('click',(e) => {
					var zip=e.currentTarget.elm('td').attr('id');
					if (callback) callback({
						prefecture:{
							id:this.prefecture.val(),
							name:this.prefecture.selectedtext()
						},
						city:{
							id:this.city.val(),
							name:this.city.selectedtext()
						},
						street:{
							id:zip,
							name:e.currentTarget.elm('td').text().replace(/ $/g,'')
						},
						address:this.prefecture.selectedtext()+this.city.selectedtext()+e.currentTarget.elm('td').text().replace(/ $/g,''),
						zip:((zip.length==7)?zip.substr(0,3)+'-'+zip.substr(3,4):zip)
					});
					this.hide();
				});
			})
		);
		/* setup elements */
		this.pickupprefecture(() => {
			if (prefecture) this.prefecture.val(prefecture);
		});
		this.pickupcity(prefecture,() => {
			if (city) this.city.val(city);
		});
		this.pickupstreet(prefecture,city,() => {
			/* show */
			this.cover.css({display:'block',zIndex:tis.window.alert.cover.style.zIndex-2});
		});
	}
	/* hide records */
	hide(){
		this.cover.css({display:'none'});
	}
};
class tiscalendar{
	/* constructor */
	constructor(callback){
		var div=tis.create('div');
		var img=tis.create('img');
		var span=tis.create('span');
		var week=['日','月','火','水','木','金','土'];
		/* initialize valiable */
		div.css({
			boxSizing:'border-box',
			position:'relative',
			width:'100%'
		});
		img.css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			cursor:'pointer',
			display:'block',
			height:'2em',
			margin:'0px',
			position:'absolute',
			top:'0px',
			width:'2em'
		});
		span.css({
			boxSizing:'border-box',
			display:'block',
			lineHeight:'2em',
			position:'relative',
			textAlign:'center',
			width:'100%'
		});
		/* setup properties */
		this.callback=callback;
		this.activedate=new Date();
		this.month=new Date().calc('first-of-month');
		this.styles={
			active:{
				backgroundColor:'#42a5f5',
				color:'#ffffff'
			},
			normal:{
				backgroundColor:'transparent',
				color:tis.elm('body').css('color')
			},
			saturday:{
				backgroundColor:'transparent',
				color:'#42a5f5'
			},
			sunday:{
				backgroundColor:'transparent',
				color:'#fa8273'
			},
			today:{
				backgroundColor:'#ffb46e',
				color:'#ffffff'
			}
		};
		this.container=div.clone();
		this.contents=tis.create('table').css({
			borderCollapse:'collapse',
			tableLayout:'fixed',
			width:'100%'
		});
		this.caption=span.clone();
		this.prev=img.clone()
		.css({left:'0px'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjZJREFUeNpiYKAJ6J8y8T+MzYIm0QCk6pHFmNA016ObhqKgMCefkfoOBggg6vr9Psz/LLgCBcVb6BI4gxSvQqJMAQggugYDinNYSNVAUDOxHmbCJghNRo2ENDMSG+VASoGq6RMggIY7Agbae6Limdh4ZyGgaT2QCiAphRGbyliwaALZtJ7s5EksYCTF2ehJE6fNUIUbqFIIUFQuYUskAwcAAmgUUTP3F5CUpSi0DD07TqCZxUDLQBXBfVL1sZBpmQCQoiiPsJCRIQWoES3ENAn2AykHaic+Rlr6GF8DgJGWcUx1i4lN1TS1GF8+HpC2FqGSa+QBgAAaRaNgFBBVcJDVm6BCL4uo2ouFShYaAKnzNG/6oFkKstCALm0uarS7mMi0tJ+ujT1i+79UtRhav/ZTKwewUDubULN5S5MRO4KJC9pu+kB3i6GWC4KoAWvQkxL0hFqYJOdjqIET6BLUWCwHBbsg3S2GWv4B6vsLdLUYyQGGQMqQ5omL2IKG6omL3tluFIwCkgFAgPbN6AZAGASi1XQQR3BD3aSrGhLilzZqoQK9iwu8RLnrUfFAEORKbla63NNSRbq21KPZOCQFqJIqC133wAxJt2FU+uZsCHRPF9d+QgFzq7FJlwymgHk/U3pCdgfmgpMm7PL3p5MVIU8bsTQUpbtxcRsxB6xtI9Ka02CaPL7SLdFSLUtrDi2TwJq2ZB5YOni4ApaIlm6Bvx4eQgC/8fVQwE9sLizwnc3hbwMIgobRAdIK28oCHbudAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			/* calc months */
			this.month=this.month.calc('-1 month').calc('first-of-month');
			/* show calendar */
			this.show();
		});
		this.next=img.clone()
		.css({right:'0px'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAi1JREFUeNpiYKAa6J8y8T8Q30cXZ0LjK4AU4lMANw3GZkGXLMzJZ2QgpIskABBAVPI/Xr9DA6gBn7/rcUri9DNJACCAaO9lXICRkGZ8HmQkxWZ0g5iIdGEjNhew4NHwAKhBkWaBCxBAwwUBo+o9sWqxRZUAsamMiUDJtJ4szVAQgM8VTMRmFiAOIEszLsBCjCJcOYuQzRvwZUkWUm2jWiIZOAAQQKMIW8QV0MJcRmKyExI3EJjsNgyExchAEeiIBwNhMTIQBDriw0BYDAMfgA4QHAiLkcEBoCMcKSo1aeFjallMchxTYjFFqZpUi6mWjwes5Bp5ACCARtEoGJlNn/+0KESI7RD0U7vRTEpPRADqewN6WwwD54GWnx/Ixh5Z9TBVOn1A8B7osP6BsBgECshplzENVLZjona2JzbbUdtiogdDaGHxB2K69dS2uJDe7WqSBy+o4eMJ5IyYUOpjsksuci2+ALTQkBIXk2OxIdDSC5TGDwuJ2USQWomRidrZZBSMggEHAAHaNaMbAEEYiBLDgo7AJo7gaI7gCI5giMSAn0LLNb0XBuAlhF4LXIQQU3Q/vZfcnsPI2jNPtSZck+e66W/utCjcpPzw/DC4vAjXZPHNk/DbDxT53YvwVz6pvecACNec5aY/vAg3zb5UmUMVFitzFoSHlrklOCMa2OPQI40qLHZpIQmrlKXZwurBI06SnBYtNYUhmgdpYbj2UEIYegAwStjMiIcQQkxxA49895hLUEtfAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			/* calc months */
			this.month=this.month.calc('1 month').calc('first-of-month');
			/* show calendar */
			this.show();
		});
		/* create cells */
		for (var i=0;i<week.length*7;i++)
		{
			if (i%week.length==0) this.contents.append(tis.create('tr'));
			this.contents.elms('tr').last().append(
				tis.create('td').css({
					border:'1px solid #c9c9c9',
					boxSizing:'border-box',
					color:this.styles.normal.color,
					fontSize:'13px',
					margin:'0px',
					padding:'0.5em',
					textAlign:'center'
				})
				.append(span.clone().css({color:this.styles.normal.color}).addclass('day'))
			);
		}
		/* create header */
		this.contents.elms('tr')[0].elms('td').some((item,index) => {
			item.html(week[index]);
		});
		this.contents.elms('tr').some((item,index) => {
			if (index>0)
			{
				/* setup styles */
				item.elms('td')[0].css(this.styles.sunday);
				item.elms('td')[6].css(this.styles.saturday);
			}
		});
		/* append elements */
		this.container
		.append(
			div.clone().css({
				marginBottom:'0.5em'
			})
			.append(this.caption)
			.append(this.prev)
			.append(this.next)
		)
		.append(this.contents);
	}
	/* show calendar */
	show(activedate,showactivedate=true){
		var row=0;
		var cell=0;
		var cells={};
		if (activedate)
			if (activedate.match(/^[0-9]{4}(-|\/){1}[0-1]?[0-9]{1}(-|\/){1}[0-3]?[0-9]{1}$/g))
			{
				this.activedate=new Date(activedate.replace(/-/g,'\/'));
				this.month=this.activedate.calc('first-of-month');
			}
		/* setup calendar */
		this.caption.html(this.month.format('Y-m'));
		this.contents.elms('tr').some((item,index) => {
			if (row>0)
				item.elms('td').some((item,index) => {
					var day=this.month;
					var span=cell-this.month.getDay();
					var style=this.styles.normal;
					tis.children(item).some((element,index) => {
						if (!element.hasclass('day')) item.removeChild(element);
					});
					/* not process if it less than the first of this month */
					if (span<0)
					{
						item.css(style).elm('.day').css(style).html('&nbsp;');
						cell++;
						return false;
					}
					else day=day.calc(span.toString()+' day');
					/* not process it if it exceeds the end of this month */
					if (day.format('Y-m')!=this.month.format('Y-m'))
					{
						item.css(style).elm('.day').css(style).html('&nbsp;');
						cell++;
						return false;
					}
					/* setup styles */
					switch ((cell+1)%7)
					{
						case 0:
							style=this.styles.saturday;
							break;
						case 1:
							style=this.styles.sunday;
							break;
					}
					if(day.format('Y-m-d')==new Date().format('Y-m-d')) style=this.styles.today;
					if (showactivedate)
						if (day.format('Y-m-d')==this.activedate.format('Y-m-d')) style=this.styles.active;
					style['cursor']='pointer';
					item.css(style).elm('.day').css(style).html((span+1).toString());
					cells[day.format('Y-m-d')]=item;
					cell++;
				});
			row++;
		});
		if (this.callback) this.callback(this.month.format('Y-m'),cells);
	}
};
class tiscoloradjuster{
	/* constructor */
	constructor(){
		var canvas=tis.create('canvas');
		var div=tis.create('div');
		var img=tis.create('img');
		var span=tis.create('span');
		var listener=(e) => {
			var iscanvas=false;
			var rect={
				clip:null,
				container:null
			};
			if (e.currentTarget==this.hue.clip) this.params.target='hue';
			if (e.currentTarget==this.saturation.clip) this.params.target='saturation';
			if (e.currentTarget==this.brightness.clip) this.params.target='brightness';
			if (e.currentTarget==this.hue.canvas) {this.params.target='hue';iscanvas=true;}
			if (e.currentTarget==this.saturation.canvas) {this.params.target='saturation';iscanvas=true;}
			if (e.currentTarget==this.brightness.canvas) {this.params.target='brightness';iscanvas=true;}
			switch(this.params.target)
			{
				case 'hue':
					this.params.clip=this.hue.clip;
					this.params.canvas=this.hue.canvas;
					this.params.container=this.hue.container;
					break;
				case 'saturation':
					this.params.clip=this.saturation.clip;
					this.params.canvas=this.saturation.canvas;
					this.params.container=this.saturation.container;
					break;
				case 'brightness':
					this.params.clip=this.brightness.clip;
					this.params.canvas=this.brightness.canvas;
					this.params.container=this.brightness.container;
					break;
			}
			rect.clip=this.params.clip.getBoundingClientRect();
			rect.container=this.params.container.getBoundingClientRect();
			this.params.keep=e.pageX;
			if (iscanvas)
			{
				this.params.down=e.pageX-rect.container.left;
				this.params.clip.css({'left':this.params.down.toString()+'px'});
			}
			else this.params.down=rect.clip.left+rect.clip.width/2-rect.container.left;
			this.capture=true;
			/* adjust volume */
			this.adjustvolume();
			e.stopPropagation();
			e.preventDefault();
		};
		/* initialize valiable */
		canvas.css({
			borderRadius:'0.25em',
			boxSizing:'border-box',
			cursor:'crosshair',
			display:'none',
			margin:'0px',
			position:'relative',
			verticalAlign:'top'
		});
		div.css({
			boxSizing:'border-box',
			position:'relative'
		});
		img.css({
			backgroundColor:'transparent',
			border:'none',
			bottom:'0px',
			boxSizing:'border-box',
			cursor:'pointer',
			display:'block',
			height:'0.75em',
			left:'4em',
			margin:'0px 0px 0px -0.5em',
			position:'absolute',
			transition:'none',
			width:'1em'
		})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAtCAYAAAGFcTjaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAm1JREFUeNpiYCAFTJgy8TwQ/0cWY0JTYwBV+B9DAbpOFAUgo7FY9x/ZBAMcbvoPEEAk+eA/EAvgc9x7XF5DUciIx3JBRnyuAgggYhyIUzMjPo3I/IKcfEaCmqGhboDDTEGgIR+waibWfzBXMJIXXRADGAk4Ey8ACCBCod2PT54Jj0aQawrI0gwE5wmFBRMxcYzL+Uw4nIsRuMTafJ7YnMdESiJBdz4TAefidT4TIeficz4TOUkT5nwmIp2L1flMxDoXm/MBAoiRgnQPy1AoeZxYwESui5Fy8XtCmY+k4g9PJj1PqHCiqsUklFVEBT0TGUFLCBAV9IyUBC2x9QKpVRy1qgGsQc9EhaAlK+gZqRm0pAQ9Iw2Clvj2ANmNJPJBI0AA4uvmBkAQhgKwvkkcwRHcDDZjBTfoKv4kJh4IFNtXOXkxj35gUy2jQrYkw/BuOsMlNPh1NMv5vIUEV4hLVMWpshmhBjdu/zA5HG9xYVWcFJsT1+CBBqMmB6FRFK+K04dPTkzBhh7eJQerF/fI4Uk8Qg5nYjU5CMQqcjCINeQgEXfJQSRukoNJ3CIHmbhGvj5/5nmKXffcPv8w2l5rPwToxu5uAARhIADnGhdiBDdjMx3BERxF4iMxIj89WpvwTC79EmgX9o3ZtLKmD/7OvF/IYWM2mm0tW4yeAjHs20h4phNadkfmAlcO3OrEhUy4+IhoE8ckwqVSI47JhOnEZTJhOnEYIUwjDmOE1YmLMcLqxGGUsBpxGCc8nLgYJzycOJwQHkYczgh3ExdnhLuJwynhZuJwTriauDgn/IV4fOywc8KlOlKnwx34Z4RLFS4eo2RZccIohAAAAABJRU5ErkJggg==');
		span.css({
			boxSizing:'border-box',
			display:'inline-block',
			fontSize:'0.8em',
			lineHeight:'1.875em',
			margin:'0px',
			padding:'0px 1.25em 0px 0px',
			position:'relative',
			verticalAlign:'top',
			width:'3.75em'
		});
		/* setup properties */
		this.capture=false;
		this.callback=null;
		this.params={
			target:'',
			down:0,
			keep:0,
			clip:null,
			canvas:null,
			container:null
		};
		this.cover=div.clone().css({
			backgroundColor:'rgba(0,0,0,0.5)',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999997'
		});
		this.container=div.clone().css({
			backgroundColor:'#ffffff',
			borderRadius:'0.5em',
			boxShadow:'0px 0px 3px rgba(0,0,0,0.35)',
			height:'22.75em',
			left:'50%',
			maxHeight:'calc(100% - 1em)',
			maxWidth:'calc(100% - 1em)',
			padding:'2em 0px 0px 0px',
			position:'absolute',
			top:'50%',
			transform:'translate(-50%,-50%)',
			width:'600px'
		});
		this.contents=div.clone().css({
			height:'100%',
			overflowX:'hidden',
			overflowY:'auto',
			padding:'0px',
			textAlign:'center',
			width:'100%'
		});
		this.close=tis.create('img').css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			cursor:'pointer',
			display:'block',
			height:'2em',
			margin:'0px',
			position:'absolute',
			right:'0px',
			top:'0px',
			width:'2em'
		})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9pJREFUeNpiYKAUMMIY/VMmvgdSAjB+YU4+WI4JSbFAQXYeA5KG/+gKGCZMncSArAhDAUyRm7MriCmI4gZkY0GSQDd8IMoXAAFEHf//RxL/ALRbkAldAuo1AQxvgSRA3kL3syDIn8gS6HaCjHqPHN54AUAAUceraMENdwISwAh6RmyaQJ7btXc3ik4kMbgh6CkAbBtMIyjoYEkGybD3OJMPephjS3M4/YyezNEAONqpEtoAATREEa5Egh5oWAMKW2j/x2UTeoJnwqYxMyUdRROMj24wzkQC04BuEDJgRrK1AUg5gNhnzp1lMDUyYbCxtGb4+/cvw/Q5M+EaPLw8GXdu23EAr80kA5CfQPjHjx9gjM4m2s8wpyI7mXZRhaTgA5bcxDh40jZAAI3mZmLToQMsF0DBAWBEHqC6xUCL1gOpABLM3QB0SCDZFpNhIdEOYMRjKUrhCSqJ2NnZGX7+/Ik1h+KRJ67QRYrD/biKRGQLCDkIChzR0wALDoUOhMol5BofvW2Ew7wDxBR8B/BVAiALQT4EWQiiQXx8lQI28wZXHA9oqh7QfEzLkmvkAYAAGkWjYNC1QAqQilNQkTiBZhZDG/31BJQ1Ah3RQBWLcXS5CQGCoyFMBCw1IMNScE8cqpc8i4HgPAXp5zxZFkPrY5ShAlERUZwGgeTQhxDQzSBoMTReMYYWosMjsVoOEgPJYQECULOI9vF6dIGlK5djtRzZUpgaQmbhsxijsff6zWsMy9EtBakhtuFIUv8a3XIiLCU7VWO1HHk0DMQm1VKyLAYFL3Q8FT4Ehy+1U8Vi9DjFleAosfgAIUtBwYstwRHbOcBlcSC2PIwtIaFbToxZOC2GFvAfsOVlbAkJ2XIsIy8fyOkf/6ekssc33EMocRlSYK/hoKyPB28LhFZtrlEw/AFAgPas6AZBIIZeiAM5gNG4gTH+KyM4gSPoBuq/MW5gNA7AJrCBXrEm98HJtQVE6Av9BO6l7bV91UehUHRfhQismlAxQfpcmi/St6chPZq3FJq1mjC2Bhvj35tzkGFPs2sFYRQ59taGDURkYi225JPGCWPIXhsiWkR8ygn5SBC66Y/IGvxviueo18Nlc4SrcMHm6XQ5kwQKmKwXs3m+ufqgZH8XPLOQCVuyK8xX0oFDiHPfQ0BeH+og/JR4qoiAkGjQ4M8diSFfttQU8BG6Pe5mMhqLibqcQ0rXgPBBVm2Fw8MG2SUO5uqBQqKk80WmZ6B4mNXmhYQ0GMiPQk9nemkJPZxf/1WXJV+OEz0ea+NRZS/NLVE1YE2dono3POh4qAJAxyQehUKh+Cu8AL45fzrg+n0KAAAAAElFTkSuQmCC')
		.on('click',(e) => this.hide());
		this.informations=div.clone().css({
			border:'1px solid #9e9e9e',
			borderRadius:'0.25em',
			display:'inline-block',
			lineHeight:'1.5em',
			margin:'0px 0px 1em 4em',
			padding:'1em',
			verticalAlign:'top',
			width:'calc(50% - 4em)'
		});
		this.thumbnail=div.clone().css({
			borderRadius:'0.25em',
			display:'inline-block',
			height:'8em',
			margin:'0px 10% 1em 10%',
			verticalAlign:'top',
			width:'30%'
		});
		this.hex=tis.create('input').css({
			backgroundColor:'transparent',
			border:'1px solid #9e9e9e',
			borderRadius:'0.25em',
			boxSizing:'border-box',
			display:'inline-block',
			fontSize:'0.8em',
			height:'1.5625em',
			lineHeight:'1.5625em',
			margin:'0.125em 0px',
			outline:'none',
			padding:'0px 0.25em',
			position:'relative',
			verticalAlign:'top',
			width:'calc(100% - 3.75em)'
		})
		.attr('type','text')
		.on('change',(e) => {
			var color=e.currentTarget.val().replace(/#/g,'');
			if (color.length==6)
			{
				/* convert HSB color */
				this.toHSB(color)
				/* attach volume */
				this.attachvolume();
				if (this.callback) this.callback('#'+color);
			}
		});
		/* setup hue properties */
		this.hue={
			caption:span.clone().html('色相'),
			display:span.clone().css({width:'calc(100% - 3.75em)'}),
			clip:img.clone().on('touchstart,mousedown',listener),
			canvas:canvas.clone().on('touchstart,mousedown',listener),
			container:div.clone().css({height:'2.25em',margin:'1em 0px 0px 0px',padding:'0px 1em 0.75em 1em',width:'100%'}),
			max:359,
			volume:0
		};
		/* setup saturation properties */
		this.saturation={
			caption:span.clone().html('彩度'),
			display:span.clone().css({width:'calc(100% - 3.75em)'}),
			clip:img.clone().on('touchstart,mousedown',listener),
			canvas:canvas.clone().on('touchstart,mousedown',listener),
			container:div.clone().css({height:'2.25em',margin:'1em 0px 0px 0px',padding:'0px 1em 0.75em 1em',width:'100%'}),
			max:100,
			volume:0
		};
		/* setup brightness properties */
		this.brightness={
			caption:span.clone().html('明度'),
			display:span.clone().css({width:'calc(100% - 3.75em)'}),
			clip:img.clone().on('touchstart,mousedown',listener),
			canvas:canvas.clone().on('touchstart,mousedown',listener),
			container:div.clone().css({height:'2.25em',margin:'1em 0px 0px 0px',padding:'0px 1em 0.75em 1em',width:'100%'}),
			max:100,
			volume:0
		};
		/* append elements */
		tis.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(
					this.contents
					.append(this.informations
							.append(span.clone().html('色相'))
							.append(this.hue.display.css({padding:'0px',textAlign:'left'}))
							.append(span.clone().html('彩度'))
							.append(this.saturation.display.css({padding:'0px',textAlign:'left'}))
							.append(span.clone().html('明度'))
							.append(this.brightness.display.css({padding:'0px',textAlign:'left'}))
							.append(span.clone().html('#'))
							.append(this.hex)
						)
						.append(this.thumbnail)
						.append(
							this.hue.container
							.append(this.hue.caption)
							.append(this.hue.canvas)
							.append(this.hue.clip)
						)
						.append(
							this.saturation.container
							.append(this.saturation.caption)
							.append(this.saturation.canvas)
							.append(this.saturation.clip)
						)
						.append(
							this.brightness.container
							.append(this.brightness.caption)
							.append(this.brightness.canvas)
							.append(this.brightness.clip)
						)
				)
				.append(this.close)
			)
		);
		/* mouse event */
		window.on('touchmove,mousemove',(e) => {
			if (!this.capture) return;
			var position=e.pageX+this.params.down-this.params.keep;
			var rect={
				canvas:this.params.canvas.getBoundingClientRect(),
				container:this.params.container.getBoundingClientRect()
			};
			if (e.pageX<rect.canvas.left) position=rect.canvas.left-rect.container.left;
			if (e.pageX>rect.canvas.right) position=rect.canvas.right-rect.container.left;
			this.params.clip.css({'left':position.toString()+'px'});
			/* adjust volume */
			this.adjustvolume();
			e.stopPropagation();
			e.preventDefault();
		});
		window.on('touchend,mouseup',(e) => {
			if (!this.capture) return;
			this.capture=false;
			e.stopPropagation();
			e.preventDefault();
		});
		/* resize event */
		window.on('resize',(e) => {
			/* attach volume */
			this.attachvolume();
		});
	}
	/* adjust volume */
	adjustvolume(){
		var position=parseInt(this.params.clip.css('left'));
		var rect={
			canvas:this.params.canvas.getBoundingClientRect(),
			container:this.params.container.getBoundingClientRect()
		};
		position-=rect.canvas.left-rect.container.left;
		switch(this.params.target)
		{
			case 'hue':
				this.hue.volume=Math.ceil((position/rect.canvas.width)*this.hue.max);
				break;
			case 'saturation':
				this.saturation.volume=Math.ceil((position/rect.canvas.width)*this.saturation.max);
				break;
			case 'brightness':
				this.brightness.volume=Math.ceil((position/rect.canvas.width)*this.brightness.max);
				break;
		}
		/* draw canvas */
		this.redraw();
		/* convert HEX color */
		this.toHEX();
		if (this.callback) this.callback('#'+this.hex.val());
	}
	/* attach volume */
	attachvolume(){
		var volumes=[this.hue,this.saturation,this.brightness];
		/* draw canvas */
		this.redraw();
		for (var i=0;i<volumes.length;i++)
		{
			var position=0;
			var rect={
				clip:volumes[i].clip.getBoundingClientRect(),
				canvas:volumes[i].canvas.getBoundingClientRect(),
				container:volumes[i].container.getBoundingClientRect()
			};
			position+=rect.canvas.left-rect.container.left;
			position+=rect.canvas.width*(volumes[i].volume/volumes[i].max);
			volumes[i].clip.css({'left':position.toString()+'px'});
		}
	}
	/* draw canvas */
	redraw(){
		var context=null;
		var height=0;
		var width=0;
		/* hue */
		height=this.hue.caption.outerheight(true);
		width=this.hue.container.innerwidth()-this.hue.caption.outerwidth(true);
		this.hue.canvas.css({display:'inline-block'}).attr('height',height.toString()+'px').attr('width',width.toString()+'px');
		if (this.hue.canvas.getContext)
		{
			context=this.hue.canvas.getContext('2d');
			for (var i=0;i<width;i++)
			{
				context.fillStyle='hsl('+(i*this.hue.max/width).toString()+',50%,50%)';
				context.fillRect(i,0,i,height);
			}
		}
		/* saturation */
		height=this.saturation.caption.outerheight(true);
		width=this.saturation.container.innerwidth()-this.saturation.caption.outerwidth(true);
		this.saturation.canvas.css({display:'inline-block'}).attr('height',height.toString()+'px').attr('width',width.toString()+'px');
		if (this.saturation.canvas.getContext)
		{
			context=this.saturation.canvas.getContext('2d');
			for (var i=0;i<width;i++)
			{
				context.fillStyle='hsl('+this.hue.volume.toString()+','+(i*this.saturation.max/width)+'%,50%)';
				context.fillRect(i,0,i,height);
			}
		}
		/* brightness */
		height=this.brightness.caption.outerheight(true);
		width=this.brightness.container.innerwidth()-this.brightness.caption.outerwidth(true);
		this.brightness.canvas.css({display:'inline-block'}).attr('height',height.toString()+'px').attr('width',width.toString()+'px');
		if (this.brightness.canvas.getContext)
		{
			context=this.brightness.canvas.getContext('2d');
			for (var i=0;i<width;i++)
			{
				context.fillStyle='hsl(0,0%,'+(i*this.brightness.max/width)+'%)';
				context.fillRect(i,0,i,height);
			}
		}
	}
	/* convert HEX color */
	toHEX(){
		var color='';
		var hsb={h:this.hue.volume,s:this.saturation.volume,b:this.brightness.volume};
		var rgb={r:0,g:0,b:0};
		var hex=(value) => {
			var sin="0123456789ABCDEF";
			if(value>255) return 'FF';
			if(value<0) return '00';
			return sin.charAt(Math.floor(value/16))+sin.charAt(value%16);
		};
		hsb.h/=60;
		hsb.s/=100;
		hsb.b/=100;
		rgb.r=hsb.b;
		rgb.g=hsb.b;
		rgb.b=hsb.b;
		if (hsb.s>0)
		{
			var index=Math.floor(hsb.h);
			switch (index)
			{
				case 0:
					rgb.g=hsb.b*(1-hsb.s*(1-(hsb.h-index)));
					rgb.b=hsb.b*(1-hsb.s);
					break;
				case 1:
					rgb.r=hsb.b*(1-hsb.s*(hsb.h-index));
					rgb.b=hsb.b*(1-hsb.s);
					break;
				case 2:
					rgb.r=hsb.b*(1-hsb.s);
					rgb.b=hsb.b*(1-hsb.s*(1-(hsb.h-index)));
					break;
				case 3:
					rgb.r=hsb.b*(1-hsb.s);
					rgb.g=hsb.b*(1-hsb.s*(hsb.h-index));
					break;
				case 4:
					rgb.r=hsb.b*(1-hsb.s*(1-(hsb.h-index)));
					rgb.g=hsb.b*(1-hsb.s);
					break;
				case 5:
					rgb.g=hsb.b*(1-hsb.s);
					rgb.b=hsb.b*(1-hsb.s*(hsb.h-index));
					break;
			}
		}
		color+=hex(Math.round(rgb.r*255));
		color+=hex(Math.round(rgb.g*255));
		color+=hex(Math.round(rgb.b*255));
		this.hue.display.html(this.hue.volume);
		this.saturation.display.html(this.saturation.volume);
		this.brightness.display.html(this.brightness.volume);
		this.hex.val(color);
		this.thumbnail.css({'background-color':'#'+color});
	}
	/* convert HSB color */
	toHSB(color){
		var colors=[];
		var hsb={h:0,s:0,b:0};
		var rgb={r:0,g:0,b:0};
		var diff={check:0,r:0,g:0,b:0};
		var max=0;
		var min=0;
		color=color.replace(/(#|rgba|rgb|\(|\))/g,'');
		colors=color.split(',');
		if (colors.length==1)
		{
			switch (color.length)
			{
				case 3:
					rgb.r=parseInt(color.substr(0,1),16);
					rgb.g=parseInt(color.substr(1,1),16);
					rgb.b=parseInt(color.substr(2,1),16);
					break;
				case 6:
					rgb.r=parseInt(color.substr(0,2),16);
					rgb.g=parseInt(color.substr(2,2),16);
					rgb.b=parseInt(color.substr(4,2),16);
					break;
			}
		}
		else
		{
			rgb.r=parseInt(colors[0]);
			rgb.g=parseInt(colors[1]);
			rgb.b=parseInt(colors[2]);
		}
		rgb.r/=255;
		rgb.g/=255;
		rgb.b/=255;
		hsb.b=Math.max(rgb.r,rgb.g,rgb.b);
		diff.check=hsb.b-Math.min(rgb.r,rgb.g,rgb.b);
		diff.r=(hsb.b-rgb.r)/6/diff.check+1/2;;
		diff.g=(hsb.b-rgb.g)/6/diff.check+1/2;;
		diff.b=(hsb.b-rgb.b)/6/diff.check+1/2;;
		if (diff.check!==0)
		{
			hsb.s=diff.check/hsb.b;
			if (rgb.r===hsb.b) hsb.h=diff.b-diff.g;
			else if (rgb.g===hsb.b) hsb.h=(1/3)+diff.r-diff.b;
			else if (rgb.b===hsb.b) hsb.h=(2/3)+diff.g-diff.r;
			if (hsb.h < 0) hsb.h+=1;
			else if (hsb.h > 1) hsb.h-=1;
		}
		hsb.h=Math.round(hsb.h*360);
		hsb.s=Math.round(hsb.s*100);
		hsb.b=Math.round(hsb.b*100);
		this.hue.volume=hsb.h;
		this.saturation.volume=hsb.s;
		this.brightness.volume=hsb.b;
		this.toHEX();
	}
	/* show color */
	show(color,callback){
		/* setup callback */
		if (callback) this.callback=callback;
		/* show */
		this.cover.css({display:'block',zIndex:tis.window.alert.cover.style.zIndex-2});
		/* convert HSB color */
		this.toHSB(color)
		/* attach volume */
		this.attachvolume();
	}
	/* hide color */
	hide(){
		this.cover.css({display:'none'});
	}
};
class tiscolorpicker{
	/* constructor */
	constructor(){
		var div=tis.create('div');
		/* initialize valiable */
		div.css({
			boxSizing:'border-box',
			position:'relative'
		});
		/* setup properties */
		this.callback=null;
		this.colors=[
			'#d7000f',
			'#e60012',
			'#ea5532',
			'#f6ad3c',
			'#f39800',
			'#e48e00',
			'#f3e100',
			'#fff100',
			'#fff33f',
			'#aacf52',
			'#8fc31f',
			'#86b81b',
			'#009140',
			'#009944',
			'#00a95f',
			'#00ada9',
			'#009e96',
			'#00958d',
			'#0097db',
			'#00a0e9',
			'#00afec',
			'#187fc4',
			'#0068b7',
			'#0062ac',
			'#1b1c80',
			'#1d2088',
			'#4d4398',
			'#a64a97',
			'#920783',
			'#8a017c',
			'#d60077',
			'#e4007f',
			'#e85298',
			'#e9546b',
			'#e5004f',
			'#d7004a'
		];
		this.cover=div.clone().css({
			backgroundColor:'rgba(0,0,0,0.5)',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999997'
		});
		this.container=div.clone().css({
			backgroundColor:'#ffffff',
			borderRadius:'0.5em',
			boxShadow:'0px 0px 3px rgba(0,0,0,0.35)',
			height:'calc(400px + 5em)',
			left:'50%',
			maxHeight:'calc(100% - 1em)',
			maxWidth:'calc(100% - 1em)',
			padding:'2em 0px 3em 0px',
			position:'absolute',
			top:'50%',
			transform:'translate(-50%,-50%)',
			width:'400px'
		});
		this.contents=div.clone().css({
			height:'100%',
			overflowX:'hidden',
			overflowY:'auto',
			padding:'0px 2px',
			textAlign:'center',
			width:'100%'
		});
		this.buttons=div.clone().css({
			borderTop:'1px solid #42a5f5',
			bottom:'0px',
			left:'0px',
			position:'absolute',
			width:'100%'
		});
		this.close=tis.create('img').css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			cursor:'pointer',
			display:'block',
			height:'2em',
			margin:'0px',
			position:'absolute',
			right:'0px',
			top:'0px',
			width:'2em'
		})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9pJREFUeNpiYKAUMMIY/VMmvgdSAjB+YU4+WI4JSbFAQXYeA5KG/+gKGCZMncSArAhDAUyRm7MriCmI4gZkY0GSQDd8IMoXAAFEHf//RxL/ALRbkAldAuo1AQxvgSRA3kL3syDIn8gS6HaCjHqPHN54AUAAUceraMENdwISwAh6RmyaQJ7btXc3ik4kMbgh6CkAbBtMIyjoYEkGybD3OJMPephjS3M4/YyezNEAONqpEtoAATREEa5Egh5oWAMKW2j/x2UTeoJnwqYxMyUdRROMj24wzkQC04BuEDJgRrK1AUg5gNhnzp1lMDUyYbCxtGb4+/cvw/Q5M+EaPLw8GXdu23EAr80kA5CfQPjHjx9gjM4m2s8wpyI7mXZRhaTgA5bcxDh40jZAAI3mZmLToQMsF0DBAWBEHqC6xUCL1gOpABLM3QB0SCDZFpNhIdEOYMRjKUrhCSqJ2NnZGX7+/Ik1h+KRJ67QRYrD/biKRGQLCDkIChzR0wALDoUOhMol5BofvW2Ew7wDxBR8B/BVAiALQT4EWQiiQXx8lQI28wZXHA9oqh7QfEzLkmvkAYAAGkWjYNC1QAqQilNQkTiBZhZDG/31BJQ1Ah3RQBWLcXS5CQGCoyFMBCw1IMNScE8cqpc8i4HgPAXp5zxZFkPrY5ShAlERUZwGgeTQhxDQzSBoMTReMYYWosMjsVoOEgPJYQECULOI9vF6dIGlK5djtRzZUpgaQmbhsxijsff6zWsMy9EtBakhtuFIUv8a3XIiLCU7VWO1HHk0DMQm1VKyLAYFL3Q8FT4Ehy+1U8Vi9DjFleAosfgAIUtBwYstwRHbOcBlcSC2PIwtIaFbToxZOC2GFvAfsOVlbAkJ2XIsIy8fyOkf/6ekssc33EMocRlSYK/hoKyPB28LhFZtrlEw/AFAgPas6AZBIIZeiAM5gNG4gTH+KyM4gSPoBuq/MW5gNA7AJrCBXrEm98HJtQVE6Av9BO6l7bV91UehUHRfhQismlAxQfpcmi/St6chPZq3FJq1mjC2Bhvj35tzkGFPs2sFYRQ59taGDURkYi225JPGCWPIXhsiWkR8ygn5SBC66Y/IGvxviueo18Nlc4SrcMHm6XQ5kwQKmKwXs3m+ufqgZH8XPLOQCVuyK8xX0oFDiHPfQ0BeH+og/JR4qoiAkGjQ4M8diSFfttQU8BG6Pe5mMhqLibqcQ0rXgPBBVm2Fw8MG2SUO5uqBQqKk80WmZ6B4mNXmhYQ0GMiPQk9nemkJPZxf/1WXJV+OEz0ea+NRZS/NLVE1YE2dono3POh4qAJAxyQehUKh+Cu8AL45fzrg+n0KAAAAAElFTkSuQmCC')
		.on('click',(e) => this.hide());
		this.input=tis.create('input').css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			display:'inline-block',
			fontSize:'1em',
			height:'3em',
			lineHeight:'3em',
			margin:'0px',
			outline:'none',
			padding:'0px 5em 0px 1em',
			position:'relative',
			verticalAlign:'top',
			width:'100%'
		})
		.attr('placeholder','16進数カラーコードを入力')
		.attr('type','text');
		this.submit=tis.create('button').css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			color:'#42a5f5',
			cursor:'pointer',
			display:'inline-block',
			fontSize:'1em',
			height:'3em',
			lineHeight:'3em',
			margin:'0px',
			outline:'none',
			padding:'0px',
			position:'absolute',
			right:'0px',
			textAlign:'center',
			top:'0px',
			verticalAlign:'top',
			width:'5em'
		})
		.html('OK')
		.on('mouseover',(e) => e.currentTarget.css({fontWeight:'bold'}))
		.on('mouseout',(e) => e.currentTarget.css({fontWeight:'normal'}))
		.on('click',(e) => {
			if (!this.input.val()) tis.alert('カラーコードを入力して下さい');
			else
			{
				if (this.callback) this.callback('#'+this.input.val().replace(/#/g,''));
				this.hide();
			}
		});
		/* create cells */
		for (var i=0;i<this.colors.length;i++)
			((index) => {
				this.contents.append(
					div.clone().css({
						backgroundColor:this.colors[index],
						cursor:'pointer',
						display:'inline-block',
						paddingTop:'calc(16.5% - 4px)',
						margin:'2px',
						verticalAlign:'top',
						width:'calc(16.5% - 4px)'
					})
					.on('click',(e) => {
						if (this.callback) this.callback(this.colors[index]);
						this.hide();
					})
				);
			})(i);
		/* append elements */
		tis.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(this.contents)
				.append(
					this.buttons
					.append(this.input)
					.append(this.submit)
				)
				.append(this.close)
			)
		);
	}
	/* show color */
	show(callback){
		/* setup callback */
		if (callback) this.callback=callback;
		/* setup elements */
		this.input.val('');
		/* show */
		this.cover.css({display:'block',zIndex:tis.window.alert.cover.style.zIndex-2});
	}
	/* hide color */
	hide(){
		this.cover.css({display:'none'});
	}
};
class tisdatepicker{
	/* constructor */
	constructor(){
		var div=tis.create('div');
		var img=tis.create('img');
		var week=['日','月','火','水','木','金','土'];
		var params={
			height:0,
			width:0,
			rows:7,
			cells:{
				height:30,
				width:30
			},
			margin:{
				left:10,
				right:10,
				top:5,
				bottom:10
			}
		};
		/* initialize valiable */
		params.height=params.cells.height*params.rows+params.rows*2;
		params.width=(params.cells.width+2)*week.length;
		div.css({
			boxSizing:'border-box',
			position:'relative'
		});
		img.css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			cursor:'pointer',
			display:'block',
			height:'2em',
			margin:'0px',
			position:'absolute',
			top:'0px',
			width:'2em'
		});
		/* setup properties */
		this.callback=null;
		this.activedate=new Date();
		this.month=new Date().calc('first-of-month');
		this.styles={
			active:{
				backgroundColor:'#42a5f5',
				color:'#ffffff'
			},
			normal:{
				backgroundColor:'#ffffff',
				color:tis.elm('body').css('color')
			},
			saturday:{
				backgroundColor:'#ffffff',
				color:'#42a5f5'
			},
			sunday:{
				backgroundColor:'#ffffff',
				color:'#fa8273'
			},
			today:{
				backgroundColor:'#ffb46e',
				color:'#ffffff'
			}
		};
		this.cover=div.clone().css({
			backgroundColor:'rgba(0,0,0,0.5)',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999997'
		});
		this.container=div.clone().css({
			backgroundColor:'#ffffff',
			borderRadius:'0.5em',
			boxShadow:'0px 0px 3px rgba(0,0,0,0.35)',
			height:'calc('+(params.height+params.margin.top+params.margin.bottom).toString()+'px + 4em)',
			left:'50%',
			maxHeight:'calc(100% - 1em)',
			maxWidth:'calc(100% - 1em)',
			padding:'4em 0px 0px 0px',
			position:'absolute',
			top:'50%',
			transform:'translate(-50%,-50%)'
		});
		this.contents=tis.create('table').css({
			border:'1px solid #c9c9c9',
			borderCollapse:'separate',
			borderSpacing:'0px',
			height:params.height.toString()+'px',
			marginLeft:params.margin.left.toString()+'px',
			marginRight:params.margin.right.toString()+'px',
			marginTop:params.margin.top.toString()+'px',
			marginBottom:params.margin.bottom.toString()+'px',
			width:params.width.toString()+'px'
		});
		this.buttons=div.clone().css({
			left:'0px',
			position:'absolute',
			top:params.cells.height.toString()+'px',
			width:'100%'
		});
		this.caption=tis.create('span').css({
			boxSizing:'border-box',
			display:'block',
			lineHeight:'2em',
			position:'relative',
			textAlign:'center',
			width:'100%'
		});
		this.close=img.clone()
		.css({right:'0px'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9pJREFUeNpiYKAUMMIY/VMmvgdSAjB+YU4+WI4JSbFAQXYeA5KG/+gKGCZMncSArAhDAUyRm7MriCmI4gZkY0GSQDd8IMoXAAFEHf//RxL/ALRbkAldAuo1AQxvgSRA3kL3syDIn8gS6HaCjHqPHN54AUAAUceraMENdwISwAh6RmyaQJ7btXc3ik4kMbgh6CkAbBtMIyjoYEkGybD3OJMPephjS3M4/YyezNEAONqpEtoAATREEa5Egh5oWAMKW2j/x2UTeoJnwqYxMyUdRROMj24wzkQC04BuEDJgRrK1AUg5gNhnzp1lMDUyYbCxtGb4+/cvw/Q5M+EaPLw8GXdu23EAr80kA5CfQPjHjx9gjM4m2s8wpyI7mXZRhaTgA5bcxDh40jZAAI3mZmLToQMsF0DBAWBEHqC6xUCL1gOpABLM3QB0SCDZFpNhIdEOYMRjKUrhCSqJ2NnZGX7+/Ik1h+KRJ67QRYrD/biKRGQLCDkIChzR0wALDoUOhMol5BofvW2Ew7wDxBR8B/BVAiALQT4EWQiiQXx8lQI28wZXHA9oqh7QfEzLkmvkAYAAGkWjYNC1QAqQilNQkTiBZhZDG/31BJQ1Ah3RQBWLcXS5CQGCoyFMBCw1IMNScE8cqpc8i4HgPAXp5zxZFkPrY5ShAlERUZwGgeTQhxDQzSBoMTReMYYWosMjsVoOEgPJYQECULOI9vF6dIGlK5djtRzZUpgaQmbhsxijsff6zWsMy9EtBakhtuFIUv8a3XIiLCU7VWO1HHk0DMQm1VKyLAYFL3Q8FT4Ehy+1U8Vi9DjFleAosfgAIUtBwYstwRHbOcBlcSC2PIwtIaFbToxZOC2GFvAfsOVlbAkJ2XIsIy8fyOkf/6ekssc33EMocRlSYK/hoKyPB28LhFZtrlEw/AFAgPas6AZBIIZeiAM5gNG4gTH+KyM4gSPoBuq/MW5gNA7AJrCBXrEm98HJtQVE6Av9BO6l7bV91UehUHRfhQismlAxQfpcmi/St6chPZq3FJq1mjC2Bhvj35tzkGFPs2sFYRQ59taGDURkYi225JPGCWPIXhsiWkR8ygn5SBC66Y/IGvxviueo18Nlc4SrcMHm6XQ5kwQKmKwXs3m+ufqgZH8XPLOQCVuyK8xX0oFDiHPfQ0BeH+og/JR4qoiAkGjQ4M8diSFfttQU8BG6Pe5mMhqLibqcQ0rXgPBBVm2Fw8MG2SUO5uqBQqKk80WmZ6B4mNXmhYQ0GMiPQk9nemkJPZxf/1WXJV+OEz0ea+NRZS/NLVE1YE2dono3POh4qAJAxyQehUKh+Cu8AL45fzrg+n0KAAAAAElFTkSuQmCC')
		.on('click',(e) => this.hide());
		this.prev=img.clone()
		.css({left:'0px'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjZJREFUeNpiYKAJ6J8y8T+MzYIm0QCk6pHFmNA016ObhqKgMCefkfoOBggg6vr9Psz/LLgCBcVb6BI4gxSvQqJMAQggugYDinNYSNVAUDOxHmbCJghNRo2ENDMSG+VASoGq6RMggIY7Agbae6Limdh4ZyGgaT2QCiAphRGbyliwaALZtJ7s5EksYCTF2ehJE6fNUIUbqFIIUFQuYUskAwcAAmgUUTP3F5CUpSi0DD07TqCZxUDLQBXBfVL1sZBpmQCQoiiPsJCRIQWoES3ENAn2AykHaic+Rlr6GF8DgJGWcUx1i4lN1TS1GF8+HpC2FqGSa+QBgAAaRaNgFBBVcJDVm6BCL4uo2ouFShYaAKnzNG/6oFkKstCALm0uarS7mMi0tJ+ujT1i+79UtRhav/ZTKwewUDubULN5S5MRO4KJC9pu+kB3i6GWC4KoAWvQkxL0hFqYJOdjqIET6BLUWCwHBbsg3S2GWv4B6vsLdLUYyQGGQMqQ5omL2IKG6omL3tluFIwCkgFAgPbN6AZAGASi1XQQR3BD3aSrGhLilzZqoQK9iwu8RLnrUfFAEORKbla63NNSRbq21KPZOCQFqJIqC133wAxJt2FU+uZsCHRPF9d+QgFzq7FJlwymgHk/U3pCdgfmgpMm7PL3p5MVIU8bsTQUpbtxcRsxB6xtI9Ka02CaPL7SLdFSLUtrDi2TwJq2ZB5YOni4ApaIlm6Bvx4eQgC/8fVQwE9sLizwnc3hbwMIgobRAdIK28oCHbudAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			/* calc months */
			this.month=this.month.calc('-1 month').calc('first-of-month');
			/* show calendar */
			this.show();
		});
		this.next=img.clone()
		.css({right:'0px'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAi1JREFUeNpiYKAa6J8y8T8Q30cXZ0LjK4AU4lMANw3GZkGXLMzJZ2QgpIskABBAVPI/Xr9DA6gBn7/rcUri9DNJACCAaO9lXICRkGZ8HmQkxWZ0g5iIdGEjNhew4NHwAKhBkWaBCxBAwwUBo+o9sWqxRZUAsamMiUDJtJ4szVAQgM8VTMRmFiAOIEszLsBCjCJcOYuQzRvwZUkWUm2jWiIZOAAQQKMIW8QV0MJcRmKyExI3EJjsNgyExchAEeiIBwNhMTIQBDriw0BYDAMfgA4QHAiLkcEBoCMcKSo1aeFjallMchxTYjFFqZpUi6mWjwes5Bp5ACCARtEoGJlNn/+0KESI7RD0U7vRTEpPRADqewN6WwwD54GWnx/Ixh5Z9TBVOn1A8B7osP6BsBgECshplzENVLZjona2JzbbUdtiogdDaGHxB2K69dS2uJDe7WqSBy+o4eMJ5IyYUOpjsksuci2+ALTQkBIXk2OxIdDSC5TGDwuJ2USQWomRidrZZBSMggEHAAHaNaMbAEEYiBLDgo7AJo7gaI7gCI5giMSAn0LLNb0XBuAlhF4LXIQQU3Q/vZfcnsPI2jNPtSZck+e66W/utCjcpPzw/DC4vAjXZPHNk/DbDxT53YvwVz6pvecACNec5aY/vAg3zb5UmUMVFitzFoSHlrklOCMa2OPQI40qLHZpIQmrlKXZwurBI06SnBYtNYUhmgdpYbj2UEIYegAwStjMiIcQQkxxA49895hLUEtfAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			/* calc months */
			this.month=this.month.calc('1 month').calc('first-of-month');
			/* show calendar */
			this.show();
		});
		/* create cells */
		for (var i=0;i<week.length*params.rows;i++)
		{
			if (i%week.length==0) this.contents.append(tis.create('tr'));
			var td=tis.create('td').css({
				border:'1px solid #c9c9c9',
				boxSizing:'border-box',
				color:this.styles.normal.color,
				fontSize:'13px',
				height:params.cells.height.toString()+'px',
				lineHeight:params.cells.height.toString()+'px',
				margin:'0px',
				padding:'0px',
				textAlign:'center',
				width:params.cells.width.toString()+'px'
			}).on('click',(e) => {
				if (tis.isnumeric(e.currentTarget.text()))
				{
					var day=new Date((this.caption.text()+'-01').replace(/-/g,'\/'));
					day=day.calc((parseInt(e.currentTarget.text())-1).toString()+' day');
					if (this.callback) this.callback(day.format('Y-m-d'));
				}
				this.hide();
			});
			this.contents.elms('tr').last().append(td);
		}
		/* create header */
		this.contents.elms('tr')[0].elms('td').some((item,index) => {
			item.html(week[index]);
		});
		this.contents.elms('tr').some((item,index) => {
			if (index>0)
			{
				/* setup styles */
				item.elms('td')[0].css(this.styles.sunday);
				item.elms('td')[6].css(this.styles.saturday);
			}
		});
		/* append elements */
		tis.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(this.contents)
				.append(
					this.buttons
					.append(this.caption)
					.append(this.prev)
					.append(this.next)
				)
				.append(this.close)
			)
		);
	}
	/* show calendar */
	show(activedate,callback){
		var row=0;
		var cell=0;
		if (activedate)
			if (activedate.match(/^[0-9]{4}(-|\/){1}[0-1]?[0-9]{1}(-|\/){1}[0-3]?[0-9]{1}$/g))
			{
				this.activedate=new Date(activedate.replace(/-/g,'\/'));
				this.month=this.activedate.calc('first-of-month');
			}
		/* setup callback */
		if (callback) this.callback=callback;
		/* setup calendar */
		this.caption.html(this.month.format('Y-m'));
		this.contents.elms('tr').some((item,index) => {
			if (row>0)
				item.elms('td').some((item,index) => {
					var day=this.month;
					var span=cell-this.month.getDay();
					var style=this.styles.normal;
					/* not process if it less than the first of this month */
					if (span<0)
					{
						item.css(style).html('&nbsp;');
						cell++;
						return false;
					}
					else day=day.calc(span.toString()+' day');
					/* not process it if it exceeds the end of this month */
					if (day.format('Y-m')!=this.month.format('Y-m'))
					{
						item.css(style).html('&nbsp;');
						cell++;
						return false;
					}
					/* setup styles */
					switch ((cell+1)%7)
					{
						case 0:
							style=this.styles.saturday;
							break;
						case 1:
							style=this.styles.sunday;
							break;
					}
					if(day.format('Y-m-d')==new Date().format('Y-m-d')) style=this.styles.today;
					if (day.format('Y-m-d')==this.activedate.format('Y-m-d')) style=this.styles.active;
					style['cursor']='pointer';
					item.css(style).html((span+1).toString());
					cell++;
				});
			row++;
		});
		/* show */
		this.cover.css({display:'block',zIndex:tis.window.alert.cover.style.zIndex-2});
	}
	/* hide calendar */
	hide(){
		this.cover.css({display:'none'});
	}
};
class tismultipicker{
	/* constructor */
	constructor(){
		var button=tis.create('button');
		var div=tis.create('div');
		var active=(e) => e.currentTarget.css({fontWeight:'bold'});
		var passive=(e) => e.currentTarget.css({fontWeight:'normal'});
		/* initialize valiable */
		button.css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			color:'#42a5f5',
			cursor:'pointer',
			display:'inline-block',
			fontSize:'1em',
			lineHeight:'2.5em',
			margin:'0px',
			outline:'none',
			padding:'0px 0.5em',
			position:'relative',
			textAlign:'center',
			verticalAlign:'top',
			width:'50%'
		});
		div.css({
			boxSizing:'border-box',
			position:'relative'
		});
		/* setup properties */
		this.callback=null;
		this.table=null;
		this.columninfos={};
		this.records=[];
		this.selection=[];
		this.cover=div.clone().css({
			backgroundColor:'rgba(0,0,0,0.5)',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999997'
		});
		this.container=div.clone().css({
			backgroundColor:'#ffffff',
			borderRadius:'0.5em',
			boxShadow:'0px 0px 3px rgba(0,0,0,0.35)',
			height:'calc(34.5em + 16px)',
			left:'50%',
			maxHeight:'calc(100% - 1em)',
			maxWidth:'calc(100% - 1em)',
			minWidth:'15em',
			padding:'1em 0px 3.5em 0px',
			position:'absolute',
			top:'50%',
			transform:'translate(-50%,-50%)'
		});
		this.contents=div.clone().css({
			height:'100%',
			overflowX:'hidden',
			overflowY:'auto',
			padding:'0px',
			textAlign:'center',
			width:'100%'
		});
		this.buttons=div.clone().css({
			borderTop:'1px solid #42a5f5',
			bottom:'0px',
			left:'0px',
			position:'absolute',
			width:'100%'
		});
		this.ok=button.clone().html('OK')
		.css({borderRight:'1px solid #42a5f5'})
		.on('mouseover',active)
		.on('mouseout',passive)
		.on('focus',active)
		.on('blur',passive)
		.on('click',(e) => {
			var res=[];
			if (this.callback)
			{
				for (var i=0;i<this.selection.length;i++) res.push(this.records[this.selection[i]]);
				this.callback(res);
			}
			this.hide();
		});
		this.cancel=button.clone().html('Cancel')
		.on('mouseover',active)
		.on('mouseout',passive)
		.on('focus',active)
		.on('blur',passive)
		.on('click',(e) => this.hide());
		/* append elements */
		tis.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(this.contents)
				.append(
					this.buttons
					.append(this.ok)
					.append(this.cancel)
				)
			)
		);
	}
	/* show records */
	show(records,columninfos,callback,selected){
		var cell=null;
		var row=null;
		var div=tis.create('div');
		var td=tis.create('td');
		var th=tis.create('th');
		/* initialize valiable */
		div.css({
			backgroundColor:'#ffffff',
			borderBottom:'1px solid #42a5f5',
			boxSizing:'border-box',
			padding:'0px 0.5em',
			position:'relative'
		});
		td.css({
			border:'none',
			borderBottom:'1px solid #42a5f5',
			boxSizing:'border-box',
			cursor:'pointer',
			lineHeight:'1.5em',
			margin:'0px',
			padding:'0.25em 0.5em'
		});
		th.css({
			border:'none',
			boxSizing:'border-box',
			fontWeight:'normal',
			lineHeight:'2em',
			margin:'0px',
			padding:'0px',
			position:'-webkit-sticky',
			position:'sticky',
			textAlign:'center',
			top:'0',
			zIndex:'2'
		});
		/* check records */
		if(records instanceof Array)
		{
			if (records.length!=0)
			{
				/* setup properties */
				this.callback=callback;
				this.columninfos=columninfos;
				this.records=records;
				this.selection=[];
				/* create table */
				this.table=tis.create('table').css({
					borderCollapse:'collapse',
					width:'100%'
				})
				.append(tis.create('thead').append(tis.create('tr')))
				.append(tis.create('tbody').append(tis.create('tr')));
				for (var key in this.columninfos)
				{
					this.table.elm('thead tr').append(
						th.clone().css({
							display:(('display' in this.columninfos[key])?this.columninfos[key].display:'table-cell'),
							width:(('width' in this.columninfos[key])?this.columninfos[key].width:'auto')
						})
						.append(div.clone().html(('text' in this.columninfos[key])?this.columninfos[key].text:''))
					);
					cell=td.clone().css({
						display:(('display' in this.columninfos[key])?this.columninfos[key].display:'table-cell'),
						textAlign:(('align' in this.columninfos[key])?this.columninfos[key].align:'left')
					})
					.attr('id',key);
					if ('digit' in this.columninfos[key]) cell.attr('data-digit',this.columninfos[key].digit);
					this.table.elm('tbody tr').append(cell);
				}
				this.contents.empty().append(
					this.table.spread((row,index) => {
						row.on('click',(e) => {
							if (this.selection.indexOf(index)<0)
							{
								this.selection.push(index);
								row.css({backgroundColor:'#a0d8ef'});
							}
							else
							{
								this.selection=this.selection.filter((item) => {
									return item!=index;
								});
								row.css({backgroundColor:'transparent'});
							}
						});
					})
				);
				/* append records */
				this.table.clearrows();
				for (var i=0;i<this.records.length;i++)
				{
					var record=this.records[i];
					row=this.table.addrow();
					for (var key in this.columninfos)
					{
						if (row.elm('#'+key).hasAttribute('data-digit'))
						{
							if (record[key]) row.elm('#'+key).html(Number(record[key]).comma(row.elm('#'+key).attr('data-digit')));
							else row.elm('#'+key).html(record[key]);
						}
						else row.elm('#'+key).html(record[key]);
					}
					if (selected)
					{
						if (selected.filter((item) => {
							var exists=true;
							for (var key in item) if (item[key]!=record[key]) exists=false;
							return exists;
						}).length!=0)
						{
							this.selection.push(i);
							row.css({backgroundColor:'#a0d8ef'});
						}
					}
				}
				/* show */
				this.cover.css({display:'block',zIndex:tis.window.alert.cover.style.zIndex-2});
			}
			else tis.alert('レコードがありません');
		}
		else tis.alert('レコードの指定に誤りがあります');
	}
	/* hide records */
	hide(){
		this.cover.css({display:'none'});
	}
};
class tisrecordpicker{
	/* constructor */
	constructor(){
		var div=tis.create('div');
		var img=tis.create('img');
		/* initialize valiable */
		div.css({
			boxSizing:'border-box',
			position:'relative'
		});
		img.css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			cursor:'pointer',
			display:'block',
			height:'2em',
			margin:'0px',
			position:'absolute',
			top:'0.25em',
			width:'2em'
		});
		/* setup properties */
		this.limit=50;
		this.offset=0;
		this.table=null;
		this.columninfos={};
		this.filter=[];
		this.records=[];
		this.cover=div.clone().css({
			backgroundColor:'rgba(0,0,0,0.5)',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999997'
		});
		this.container=div.clone().css({
			backgroundColor:'#ffffff',
			borderRadius:'0.5em',
			boxShadow:'0px 0px 3px rgba(0,0,0,0.35)',
			height:'calc(33em + 16px)',
			left:'50%',
			maxHeight:'calc(100% - 1em)',
			maxWidth:'calc(100% - 1em)',
			minWidth:'15em',
			padding:'2.5em 0px 0.5em 0px',
			position:'absolute',
			top:'50%',
			transform:'translate(-50%,-50%)'
		});
		this.contents=div.clone().css({
			height:'100%',
			overflowX:'hidden',
			overflowY:'auto',
			padding:'0px',
			textAlign:'center',
			width:'100%'
		});
		this.buttons=div.clone().css({
			borderBottom:'1px solid #42a5f5',
			left:'0px',
			padding:'0.25em 0px',
			position:'absolute',
			top:'0px',
			width:'100%',
			zIndex:'2'
		});
		this.prev=img.clone()
		.css({right:'4.25em'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjZJREFUeNpiYKAJ6J8y8T+MzYIm0QCk6pHFmNA016ObhqKgMCefkfoOBggg6vr9Psz/LLgCBcVb6BI4gxSvQqJMAQggugYDinNYSNVAUDOxHmbCJghNRo2ENDMSG+VASoGq6RMggIY7Agbae6Limdh4ZyGgaT2QCiAphRGbyliwaALZtJ7s5EksYCTF2ehJE6fNUIUbqFIIUFQuYUskAwcAAmgUUTP3F5CUpSi0DD07TqCZxUDLQBXBfVL1sZBpmQCQoiiPsJCRIQWoES3ENAn2AykHaic+Rlr6GF8DgJGWcUx1i4lN1TS1GF8+HpC2FqGSa+QBgAAaRaNgFBBVcJDVm6BCL4uo2ouFShYaAKnzNG/6oFkKstCALm0uarS7mMi0tJ+ujT1i+79UtRhav/ZTKwewUDubULN5S5MRO4KJC9pu+kB3i6GWC4KoAWvQkxL0hFqYJOdjqIET6BLUWCwHBbsg3S2GWv4B6vsLdLUYyQGGQMqQ5omL2IKG6omL3tluFIwCkgFAgPbN6AZAGASi1XQQR3BD3aSrGhLilzZqoQK9iwu8RLnrUfFAEORKbla63NNSRbq21KPZOCQFqJIqC133wAxJt2FU+uZsCHRPF9d+QgFzq7FJlwymgHk/U3pCdgfmgpMm7PL3p5MVIU8bsTQUpbtxcRsxB6xtI9Ka02CaPL7SLdFSLUtrDi2TwJq2ZB5YOni4ApaIlm6Bvx4eQgC/8fVQwE9sLizwnc3hbwMIgobRAdIK28oCHbudAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			this.offset-=this.limit;
			/* search records */
			this.search();
		});
		this.next=img.clone()
		.css({right:'2.25em'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAi1JREFUeNpiYKAa6J8y8T8Q30cXZ0LjK4AU4lMANw3GZkGXLMzJZ2QgpIskABBAVPI/Xr9DA6gBn7/rcUri9DNJACCAaO9lXICRkGZ8HmQkxWZ0g5iIdGEjNhew4NHwAKhBkWaBCxBAwwUBo+o9sWqxRZUAsamMiUDJtJ4szVAQgM8VTMRmFiAOIEszLsBCjCJcOYuQzRvwZUkWUm2jWiIZOAAQQKMIW8QV0MJcRmKyExI3EJjsNgyExchAEeiIBwNhMTIQBDriw0BYDAMfgA4QHAiLkcEBoCMcKSo1aeFjallMchxTYjFFqZpUi6mWjwes5Bp5ACCARtEoGJlNn/+0KESI7RD0U7vRTEpPRADqewN6WwwD54GWnx/Ixh5Z9TBVOn1A8B7osP6BsBgECshplzENVLZjona2JzbbUdtiogdDaGHxB2K69dS2uJDe7WqSBy+o4eMJ5IyYUOpjsksuci2+ALTQkBIXk2OxIdDSC5TGDwuJ2USQWomRidrZZBSMggEHAAHaNaMbAEEYiBLDgo7AJo7gaI7gCI5giMSAn0LLNb0XBuAlhF4LXIQQU3Q/vZfcnsPI2jNPtSZck+e66W/utCjcpPzw/DC4vAjXZPHNk/DbDxT53YvwVz6pvecACNec5aY/vAg3zb5UmUMVFitzFoSHlrklOCMa2OPQI40qLHZpIQmrlKXZwurBI06SnBYtNYUhmgdpYbj2UEIYegAwStjMiIcQQkxxA49895hLUEtfAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			this.offset+=this.limit;
			/* search records */
			this.search();
		});
		this.close=img.clone()
		.css({right:'0.25em'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9pJREFUeNpiYKAUMMIY/VMmvgdSAjB+YU4+WI4JSbFAQXYeA5KG/+gKGCZMncSArAhDAUyRm7MriCmI4gZkY0GSQDd8IMoXAAFEHf//RxL/ALRbkAldAuo1AQxvgSRA3kL3syDIn8gS6HaCjHqPHN54AUAAUceraMENdwISwAh6RmyaQJ7btXc3ik4kMbgh6CkAbBtMIyjoYEkGybD3OJMPephjS3M4/YyezNEAONqpEtoAATREEa5Egh5oWAMKW2j/x2UTeoJnwqYxMyUdRROMj24wzkQC04BuEDJgRrK1AUg5gNhnzp1lMDUyYbCxtGb4+/cvw/Q5M+EaPLw8GXdu23EAr80kA5CfQPjHjx9gjM4m2s8wpyI7mXZRhaTgA5bcxDh40jZAAI3mZmLToQMsF0DBAWBEHqC6xUCL1gOpABLM3QB0SCDZFpNhIdEOYMRjKUrhCSqJ2NnZGX7+/Ik1h+KRJ67QRYrD/biKRGQLCDkIChzR0wALDoUOhMol5BofvW2Ew7wDxBR8B/BVAiALQT4EWQiiQXx8lQI28wZXHA9oqh7QfEzLkmvkAYAAGkWjYNC1QAqQilNQkTiBZhZDG/31BJQ1Ah3RQBWLcXS5CQGCoyFMBCw1IMNScE8cqpc8i4HgPAXp5zxZFkPrY5ShAlERUZwGgeTQhxDQzSBoMTReMYYWosMjsVoOEgPJYQECULOI9vF6dIGlK5djtRzZUpgaQmbhsxijsff6zWsMy9EtBakhtuFIUv8a3XIiLCU7VWO1HHk0DMQm1VKyLAYFL3Q8FT4Ehy+1U8Vi9DjFleAosfgAIUtBwYstwRHbOcBlcSC2PIwtIaFbToxZOC2GFvAfsOVlbAkJ2XIsIy8fyOkf/6ekssc33EMocRlSYK/hoKyPB28LhFZtrlEw/AFAgPas6AZBIIZeiAM5gNG4gTH+KyM4gSPoBuq/MW5gNA7AJrCBXrEm98HJtQVE6Av9BO6l7bV91UehUHRfhQismlAxQfpcmi/St6chPZq3FJq1mjC2Bhvj35tzkGFPs2sFYRQ59taGDURkYi225JPGCWPIXhsiWkR8ygn5SBC66Y/IGvxviueo18Nlc4SrcMHm6XQ5kwQKmKwXs3m+ufqgZH8XPLOQCVuyK8xX0oFDiHPfQ0BeH+og/JR4qoiAkGjQ4M8diSFfttQU8BG6Pe5mMhqLibqcQ0rXgPBBVm2Fw8MG2SUO5uqBQqKk80WmZ6B4mNXmhYQ0GMiPQk9nemkJPZxf/1WXJV+OEz0ea+NRZS/NLVE1YE2dono3POh4qAJAxyQehUKh+Cu8AL45fzrg+n0KAAAAAElFTkSuQmCC')
		.on('click',(e) => this.hide());
		this.submit=img.clone()
		.css({left:'0.25em'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA7BJREFUeNpiYKAa6J8yMQFK/yfbhP9Qej7RigkpOk+U1QABRLnf92MTZ4LSDkgKHbDpNiDoHZACvIqIChCAAKIIMeLwNtxHhTn5jCTFNHoo4FLPRISZ58mJNQdCwctIauIlKRzwAYAAGqKIkUBcNwIDp4GsRAIqFoC4gBiNAaTmEOQUZkBpWfCeXJtB4AFSMRgAYoNSE9Zyg5R0TVbaRteEnK4JZkn0TAA0rIGcwPxP+4KNWAAQQKO5mVCeg2WdA8DYP0Azi6FZTACILwAtMkQSB4ndxyZHjfbNf2LaE1RNsqBMQ4phUMsdSLEDV04+gBSkRJW3pMY5E45iA2RIIxC/x9cQhEbFeiB2pHqqhlYz/TikHUGOhLZXzpNS6TNSIT2A4nY/MQUuVS0mpibD5gCqt4NwOCARaPkCuhSJ0CyZMFo5wABAAI2iUTCwLRBoLVWAVBI10NRioIUK0JYG0UUhxRaj1TiBQEs2oLWu66FcQaDcB1ItZiHUu8bmK2hQw1op78kp85lw+HY9kUGpiFRnU24xEICaMwSDD+iwBzC3UstiEJhIpBlkta+ZqJAlBahtcT2RZhhQ0+IFxDRvkdrSgVSxGJhoEqHM9wRKs/1Q9RuoGdSCSL2E+WiW7oc5Cpbl8A3Jkduufo8jAT0AWqqIRQ1RDTtSuqmw+PwANPgCWm/CgNRWJTUa9Lja03gtp0Y+xpWi5+Nr3lJsMTRFJ5JqOTV8zAANUpyW08xiIiynncV4LBekW0MO1GQiawxwFAwrABCgXau9QRCIoYQJWMENdAJlBCZQJjCOwAZugE4AG+AGygSs4AjapJra8HF3HEcx96J/jCR91uu1r8+/PDw8/k+FUGw+jzhg9gGGT+iSMjJkLoMwzgxVS5v/xKG1Jp9tA+IfIIDOPDYRMZwRRgnozogq77dxysvZvwE2Z7E4wi17h2yMyMacI5Dl1dTZDjWCixjZZKyiiFm9EAmlmjrDOvMDlc5KE9FhQOwArHU3k1MSpqgtx3FzVbRMCW8tDnURq+AyzjCe108wO4uTZ8GOykNSlYYrqWEBJiMy25Dr7SvRiWs8WuQ7OIOpSveERalg9/j5/exJeqcVYeC7gUIUBd3i+Q9R7N5y8v0n/pDl7IRbyB/e733QvxmAwK+cQE+bSmHFVjC7F5RbVRQwirgI82vPrsE6cTFuXxTPc4NHtYiLszcbEofitlG5JUJphCFbuKdLNR77FM3lZdgw48om0MU49juIO1dMPDw8PJziBXvFttyY+HdhAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			this.offset=0;
			/* search records */
			this.search();
		});
		this.input=tis.create('input').css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			display:'inline-block',
			fontSize:'1em',
			height:'2em',
			lineHeight:'2em',
			margin:'0px',
			outline:'none',
			padding:'0px 2.5em',
			position:'relative',
			verticalAlign:'top',
			width:'100%'
		})
		.attr('placeholder','キーワードを入力')
		.attr('type','text');
		/* append elements */
		tis.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(this.contents)
				.append(
					this.buttons
					.append(this.input)
					.append(this.close)
					.append(this.next)
					.append(this.prev)
					.append(this.submit)
				)
			)
		);
	}
	/* search records */
	search(callback){
		var row=null;
		var records=this.records;
		if (this.input.val())
		{
			var keyword=this.input.val();
			records=records.filter((record) => {
				for (var key in record)
					if (record[key])
						if (record[key].toString().match(new RegExp(keyword,'ig'))) return true;
				return false;
			});
		}
		/* append records */
		this.filter=[];
		this.table.clearrows();
		for (var i=this.offset;i<this.offset+this.limit;i++)
			if (i<records.length)
			{
				row=this.table.addrow();
				for (var key in this.columninfos)
				{
					if (row.elm('#'+key).hasAttribute('data-digit'))
					{
						if (records[i][key]) row.elm('#'+key).html(Number(records[i][key]).comma(row.elm('#'+key).attr('data-digit')));
						else row.elm('#'+key).html(records[i][key]);
					}
					else row.elm('#'+key).html(records[i][key]);
				}
				this.filter.push(records[i]);
			}
		if (records.length>this.limit)
		{
			if (this.offset>0) this.prev.show();
			else this.prev.hide();
			if (this.offset+this.limit<records.length) this.next.show();
			else this.next.hide();
			this.input.css({paddingRight:'6.5em'});
		}
		else
		{
			this.prev.hide();
			this.next.hide();
			this.input.css({paddingRight:'2.5em'});
		}
		if (callback) callback();
	}
	/* show records */
	show(records,columninfos,callback){
		var cell=null;
		var div=tis.create('div');
		var td=tis.create('td');
		var th=tis.create('th');
		/* initialize valiable */
		div.css({
			backgroundColor:'#ffffff',
			borderBottom:'1px solid #42a5f5',
			boxSizing:'border-box',
			padding:'0px 0.5em',
			position:'relative'
		});
		td.css({
			border:'none',
			borderBottom:'1px solid #42a5f5',
			boxSizing:'border-box',
			cursor:'pointer',
			lineHeight:'1.5em',
			margin:'0px',
			padding:'0.25em 0.5em'
		});
		th.css({
			border:'none',
			boxSizing:'border-box',
			fontWeight:'normal',
			lineHeight:'2em',
			margin:'0px',
			padding:'0px',
			position:'-webkit-sticky',
			position:'sticky',
			textAlign:'center',
			top:'0',
			zIndex:'2'
		});
		/* check records */
		if(records instanceof Array)
		{
			if (records.length!=0)
			{
				/* setup properties */
				this.offset=0;
				this.columninfos=columninfos;
				this.records=records;
				/* setup elements */
				this.input.val('');
				/* create table */
				this.table=tis.create('table').css({
					borderCollapse:'collapse',
					width:'100%'
				})
				.append(tis.create('thead').append(tis.create('tr')))
				.append(tis.create('tbody').append(tis.create('tr')));
				for (var key in this.columninfos)
				{
					this.table.elm('thead tr').append(
						th.clone().css({
							display:(('display' in this.columninfos[key])?this.columninfos[key].display:'table-cell'),
							width:(('width' in this.columninfos[key])?this.columninfos[key].width:'auto')
						})
						.append(div.clone().html(('text' in this.columninfos[key])?this.columninfos[key].text:''))
					);
					cell=td.clone().css({
						display:(('display' in this.columninfos[key])?this.columninfos[key].display:'table-cell'),
						textAlign:(('align' in this.columninfos[key])?this.columninfos[key].align:'left')
					})
					.attr('id',key);
					if ('digit' in this.columninfos[key]) cell.attr('data-digit',this.columninfos[key].digit);
					this.table.elm('tbody tr').append(cell);
				}
				this.contents.empty().append(
					this.table.spread((row,index) => {
						row.on('click',(e) => {
							if (callback) callback(this.filter[index]);
							this.hide();
						});
					})
				);
				/* show */
				this.search(() => this.cover.css({display:'block',zIndex:tis.window.alert.cover.style.zIndex-2}));
			}
			else tis.alert('レコードがありません');
		}
		else tis.alert('レコードの指定に誤りがあります');
	}
	/* hide records */
	hide(){
		this.cover.css({display:'none'});
	}
};
class tisgraph{
	/* constructor */
	/*
	* parameters
	* @canvas	:グラフ描画キャンバス
	* @type		:グラフタイプ【circle:line】
	* @scale	:目盛設定
	*	example
	*	{
	*		position:【left:right】,
	*		width:幅,
	*		min:最小目盛,
	*		max:最大目盛
	*	}
	* @captions	:項目名
	* @styles	:マーカースタイル
	*	example
	*	for circle	['#FF0000','#00FF00','#0000FF']
	*	for line	[
	*					{
	*						color:'#FF0000',
	*						dot:false
	*					},
	*					{
	*						color:'#00FF00',
	*						dot:true
	*					}
	*				]
	* @values	:データ値
	*	for circle	[100,200,300]
	*	for line	[
	*					[100,200,300],
	*					[100,200,300]
	*				]
	*/
	constructor(canvas,type,scale,captions,styles,values){
		/* setup properties */
		this.graph=canvas;
		this.type=type;
		this.scale=scale;
		this.captions=captions;
		this.styles=styles;
		this.values=values;
		this.defaultstyle=getComputedStyle(this.graph);
		if (!('position' in this.scale)) this.scale['position']='left';
		if (!('width' in this.scale)) this.scale['width']=0;
		if (!('min' in this.scale)) this.scale['min']=null;
		if (!('max' in this.scale)) this.scale['max']=null;
		if (this.graph.getContext)
		{
			this.context=this.graph.getContext('2d');
			if (this.styles.length!=this.values.length) tis.alert('データ値とマーカスタイルの数が一致しません');
			switch(this.type)
			{
				case 'line':
					if (this.captions.length!=this.values[0].length) tis.alert('データ値との項目名の数が一致しません');
					break;
			}
		}
		else tis.alert('本サービスはご利用中のブラウザには対応しておりません');
	}
	/* draw line */
	line(type,left,top,distance,width,color,dot){
		if (this.context)
		{
			var path=new Path2D();
			path.moveTo(left,top);
			switch (type)
			{
				case 'holizontal':
					path.lineTo(left+distance,top);
					break;
				case 'vertical':
					path.lineTo(left,top+distance);
					break;
			}
			this.context.lineWidth=width;
			this.context.strokeStyle=color;
			if (dot!=0)
			{
				this.context.setLineDash([dot]);
				this.context.lineDashOffset=dot;
			}
			else this.context.setLineDash([]);
			this.context.stroke(path);
		}
	}
	/* draw graph */
	redraw(){
		var padding={left:10,right:10,top:10,bottom:10,holizontal:20,vertical:20};
		var path=new Path2D();
		/* initialize elements */
		this.context.clearRect(0,0,this.graph.clientWidth,this.graph.clientHeight);
		switch(this.type)
		{
			case 'circle':
				var from=0;
				var to=0;
				var radius=((this.graph.clientWidth>this.graph.clientHeight)?this.graph.clientHeight-padding.vertical:this.graph.clientWidth-padding.holizontal)/2;
				var center={
					x:this.graph.clientWidth/2,
					y:this.graph.clientHeight/2
				};
				/* draw graph */
				for (var i=0;i<this.values.length;i++)
				{
					to=from+(this.values[i]/100*Math.PI*2);
					path=new Path2D();
					path.moveTo(center.x,center.y);
					path.arc(center.x,center.y,radius,from-(Math.PI/2),to-(Math.PI/2),false);
					this.context.fillStyle=this.styles[i];
					this.context.fill(path);
					from=to;
				}
				break;
			case 'line':
				var left=0;
				var top=0;
				var maxvalue=(this.scale.max==null)?Number.MIN_SAFE_INTEGER:this.scale.max;
				var minvalue=(this.scale.min==null)?Number.MAX_SAFE_INTEGER:this.scale.min;
				var caption={height:0,width:0};
				var plot={height:0,width:0};
				var step={caption:1,plot:5};
				var scale={height:0,width:0,amount:0};
				/* initialize valiable */
				for (var i=0;i<this.captions.length;i++)
				{
					var captions=this.captions[i].split(/\r\n|\r|\n/);
					if (step.caption<captions.length) step.caption=captions.length;
				}
				padding={left:10,right:15,top:15+((this.scale.label)?parseFloat(this.defaultstyle.fontSize)*2:0),bottom:5,holizontal:0,vertical:0,caption:10,scale:10};
				padding.holizontal=padding.left+padding.right+padding.scale;
				padding.vertical=padding.top+padding.bottom+padding.caption;
				/* calculate scale size */
				for (var i=0;i<this.values.length;i++)
				{
					var values=this.values[i];
					for (var i2=0;i2<values.length;i2++)
					{
						if (this.scale.max==null && maxvalue<Math.ceil(values[i2])) maxvalue=Math.ceil(values[i2]);
						if (this.scale.min==null && minvalue>Math.floor(values[i2])) minvalue=Math.floor(values[i2]);
					}
				}
				if (this.scale.min==null)
				{
					if (minvalue<0)
					{
						maxvalue=Math.max(maxvalue,minvalue*-1);
						minvalue=Math.max(maxvalue,minvalue*-1)*-1;
					}
					else minvalue=0;
				}
				if (this.scale.max==null)
				{
					if (maxvalue.toString().length>1)
					{
						var pow=Math.pow(10,maxvalue.toString().length-1);
						maxvalue=Math.floor(maxvalue/pow)*pow+pow;
						if (minvalue<0) minvalue=maxvalue*-1;
					}
				}
				scale.amount=(maxvalue-minvalue)/(step.plot-1);
				if (!this.scale.width)
				{
					var scalecheck='';
					var scalelength=0;
					for (var i=0;i<step.plot;i++)
					{
						scalecheck=(maxvalue-(scale.amount*i)).toFixed(10).replace(/[0]+$/g,'').replace(/.$/g,'');
						if (scalelength<scalecheck.length) scalelength=scalecheck.length;
					}
					scale.width=scalelength*parseFloat(this.defaultstyle.fontSize)/2;
				}
				else scale.width=this.scale.width;
				scale.height=(this.graph.clientHeight-parseFloat(this.defaultstyle.fontSize)*1.5*step.caption-padding.vertical)/(step.plot-1);
				/* calculate plot size */
				plot.height=this.graph.clientHeight-parseFloat(this.defaultstyle.fontSize)*1.5*step.caption-padding.vertical;
				plot.width=this.graph.clientWidth-padding.holizontal-scale.width;
				/* calculate caption size */
				caption.height=parseFloat(this.defaultstyle.fontSize)*1.5*step.caption+padding.caption;
				caption.width=plot.width/this.captions.length;
				/* setup drawing */
				this.context.font=this.defaultstyle.fontStyle+' '+this.defaultstyle.fontVariant+' '+this.defaultstyle.fontWeight+' '+(parseFloat(this.defaultstyle.fontSize)*0.75)+'px '+this.defaultstyle.fontFamily;
				this.context.lineCap='round';
				this.context.lineJoin='round';
				this.context.textBaseline='middle';
				this.context.translate(0.5,0.5);
				/* draw scale */
				if (this.scale.position=='left')
				{
					left=scale.width+padding.left;
					top=padding.top;
					for (var i=0;i<step.plot;i++)
					{
						/* draw an additional line */
						this.line('holizontal',left+padding.scale,top,plot.width,1,this.defaultstyle.color,((i==step.plot-1)?0:2));
						/* draw scale */
						this.context.fillStyle=this.defaultstyle.color;
						this.context.textAlign='right';
						this.context.fillText(maxvalue-(scale.amount*i),left,top,scale.width);
						top+=scale.height;
					}
					/* draw an additional line */
					this.line('vertical',left+padding.scale,padding.top,plot.height,1,this.defaultstyle.color,0);
					/* draw scale caption */
					if (this.scale.label)
						if (this.scale.label.length!=0)
						{
							this.context.fillStyle=this.defaultstyle.color;
							this.context.textAlign='right';
							this.context.fillText(this.scale.label,left,padding.top-(parseFloat(this.defaultstyle.fontSize)*1.5),scale.width);
						}
				}
				else
				{
					left=plot.width+padding.left+padding.scale;
					top=padding.top;
					for (var i=0;i<step.plot;i++)
					{
						/* draw an additional line */
						this.line('holizontal',padding.left,top,plot.width,1,this.defaultstyle.color,((i==step.plot-1)?0:2));
						/* draw scale */
						this.context.fillStyle=this.defaultstyle.color;
						this.context.textAlign='left';
						this.context.fillText(maxvalue-(scale.amount*i),left,top,scale.width);
						top+=scale.height;
					}
					/* draw an additional line */
					this.line('vertical',plot.width+padding.left,padding.top,plot.height,1,this.defaultstyle.color,0);
					/* draw scale caption */
					if (this.scale.label)
						if (this.scale.label.length!=0)
						{
							this.context.fillStyle=this.defaultstyle.color;
							this.context.textAlign='left';
							this.context.fillText(this.scale.label,left,padding.top-(parseFloat(this.defaultstyle.fontSize)*1.5),scale.width);
						}
				}
				/* draw caption */
				left=((this.scale.position=='left')?(scale.width+padding.scale):0)+(caption.width/2)+padding.left;
				top=plot.height+(parseFloat(this.defaultstyle.fontSize)*0.25)+padding.top+padding.caption;
				for (var i=0;i<this.captions.length;i++)
				{
					var captions=this.captions[i].split(/\r\n|\r|\n/);
					this.context.fillStyle=this.defaultstyle.color;
					this.context.textAlign='center';
					for (var i2=0;i2<captions.length;i2++) this.context.fillText(captions[i2],left,top+(parseFloat(this.defaultstyle.fontSize)*1.5*i2),caption.width);
					left+=caption.width;
				}
				/* draw graph */
				for (var i=0;i<this.values.length;i++)
				{
					var values=this.values[i];
					var ratio=(maxvalue/(maxvalue-minvalue))-(values[0]/(maxvalue-minvalue));
					path=new Path2D();
					left=((this.scale.position=='left')?(scale.width+padding.scale):0)+(caption.width/2)+padding.left;
					path.moveTo(left,plot.height*ratio+padding.top);
					for (var i2=0;i2<values.length;i2++)
					{
						if (i2!=0)
						{
							ratio=(maxvalue/(maxvalue-minvalue))-(values[i2]/(maxvalue-minvalue));
							path.lineTo(left,plot.height*ratio+padding.top);
							path.moveTo(left,plot.height*ratio+padding.top);
						}
						left+=caption.width;
					}
					this.context.lineWidth=1;
					this.context.strokeStyle=this.styles[i].color;
					if (this.styles[i].dot)
					{
						this.context.setLineDash([5]);
						this.context.lineDashOffset=3;
					}
					else this.context.setLineDash([]);
					this.context.stroke(path);
					this.context.save();
					this.context.translate(0.5,0.5);
					this.context.stroke(path);
					this.context.restore();
				}
				break;
		}
	}
};
class tismap{
	/* constructor */
	constructor(){
		/* setup properties */
		this.map=null;
		this.centerlocation=null;
		this.directionsRenderer=null;
		this.directionsService=null;
		this.geocoder=null;
		this.watchID=null;
		this.watchaccuracy=null;
		this.watchcurrent=new Date();
		this.watchstart=new Date();
		this.balloons=[];
		this.markers=[];
	}
	/* initialize */
	/*
	* parameters
	* @mapoption
	*	-center
	*	-fullscreenControl
	*	-fullscreenControlOptions
	*	-gestureHandling
	*	-mapTypeControl
	*	-mapTypeControlOptions:{
	*	-	style:
	*	-	position:
	*	-},
	*	-overviewMapControl
	*	-panControl
	*	-scaleControl
	*	-streetViewControl
	*	-zoomControl
	*	-zoom
	*/
	init(apikey,map,mapoption,idle,clicked){
		var wait=(callback) => {
			setTimeout(() => {
				if (typeof(google)=='undefined') wait(callback);
				else callback();
			},500);
		};
		if (!apikey)
		{
			tis.alert('APIキーを取得して下さい');
			return;
		}
		/* load api */
		tis.elm('head').append(
			tis.create('script')
			.attr('type','text/javascript')
			.attr('src','https://maps.googleapis.com/maps/api/js?key='+apikey)
		);
		wait(() => {
			if (map)
			{
				this.map=new google.maps.Map(map,mapoption);
				this.directionsRenderer=new google.maps.DirectionsRenderer({suppressMarkers:true});
				this.directionsService=new google.maps.DirectionsService();
				/* idle event */
				google.maps.event.addListener(this.map,'idle',() => {
					this.centerlocation=this.map.getCenter();
					if (idle) idle();
				});
				/* click event */
				if (clicked) google.maps.event.addListener(this.map,'click',(e) => this.searchaddress(e.latLng.lat(),e.latLng.lng(),(address,postalcode) => clicked(address,postalcode,e.latLng)));
				/* resize event */
				window.on('resize',(e) => this.map.setCenter(this.centerlocation));
			}
			this.geocoder=new google.maps.Geocoder();
		});
	}
	/* get bounds */
	bounds(){
		var res=this.map.getBounds();
		return {
			north:(res)?res.getNorthEast().lat():0,
			south:(res)?res.getSouthWest().lat():0,
			east:(res)?res.getNorthEast().lng():0,
			west:(res)?res.getSouthWest().lng():0
		};
	}
	/* close information widnow */
	closeinfowindow(){
		for (var i=0;i<this.balloons.length;i++) this.balloons[i].close();
	}
	/* open information widnow */
	openinfowindow(){
		for (var i=0;i<this.balloons.length;i++)
			if (this.markers.length>i) this.balloons[i].open(this.map,this.markers[i]);
	}
	/* reload map */
	reloadmap(markers,setupcenter=false,addroute=false,callback){
		/*
		* parameters
		* @markeroptions
		*	-backcolor	:マーカー背景色
		*	-forecolor	:マーカー前景色
		*	-fontsize	:マーカーフォントサイズ
		*	-label		:マーカーラベル
		*	-click		:マーカークリックイベント
		*	-balloon	:情報ウィンドウラベル
		*/
		var addmarker=(markeroptions,index) => {
			var backcolor='#'+(('backcolor' in markeroptions)?markeroptions.backcolor:'e60012');
			var forecolor='#'+(('forecolor' in markeroptions)?markeroptions.forecolor:'000000');
			var fontsize=(('fontsize' in markeroptions)?markeroptions.fontsize:'11')+'px';
			var marker=new google.maps.Marker({
				map:this.map,
				position:new google.maps.LatLng(markeroptions.lat,markeroptions.lng)
			});
			marker.setIcon({
				anchor:new google.maps.Point(17,34),
				fillColor:backcolor,
				fillOpacity:1,
				labelOrigin:new google.maps.Point(17,11),
				path:'M26.837,9.837C26.837,17.765,17,19.89,17,34 c0-14.11-9.837-16.235-9.837-24.163C7.163,4.404,11.567,0,17,0C22.432,0,26.837,4.404,26.837,9.837z',
				scale:1,
				strokeColor:"#696969"
			});
			if ('label' in markeroptions)
				if (markeroptions.label)
					marker.setLabel({
						color:forecolor,
						fontSize:fontsize,
						text:markeroptions.label
					});
			if ('click' in markeroptions) google.maps.event.addListener(marker,'click',(e) => markeroptions.click(index));
			else
			{
				/* append balloons */
				if ('balloon' in markeroptions)
				{
					var balloon=new google.maps.InfoWindow({content:markeroptions.balloon,disableAutoPan:true});
					balloon.open(this.map,marker);
					google.maps.event.addListener(marker,'click',(e) => {
						if (!balloon.getMap()) balloon.open(this.map,marker);
					});
					this.balloons.push(balloon);
				}
			}
			this.markers.push(marker);
		};
		/* initialize markers */
		for (var i=0;i<this.markers.length;i++) this.markers[i].setMap(null);
		this.markers=[];
		/* initialize balloons */
		for (var i=0;i<this.balloons.length;i++) this.balloons[i].setMap(null);
		this.balloons=[];
		/* initialize renderer */
		this.directionsRenderer.setMap(null);
		switch (markers.length)
		{
			case 0:
				break;
			case 1:
				/* append markers */
				addmarker(markers[0],0);
				/* setup center position */
				if (setupcenter) this.map.setCenter(new google.maps.LatLng(markers[0].lat,markers[0].lng));
				if (callback) callback();
				break;
			default:
				if (addroute)
				{
					/* setup routes */
					var origin=null;
					var destination=null;
					var waypoints=[];
					for (var i=0;i<markers.length;i++)
					{
						switch (i)
						{
							case 0:
								origin=new google.maps.LatLng(markers[i].lat,markers[i].lng);
								break;
							case markers.length-1:
								destination=new google.maps.LatLng(markers[i].lat,markers[i].lng);
								break;
							default:
								waypoints.push({
									location:new google.maps.LatLng(markers[i].lat,markers[i].lng),
									stopover:true
								});
								break;
						}
					}
					/* setup center position */
					if (setupcenter) this.map.setCenter(new google.maps.LatLng(markers[0].lat,markers[0].lng));
					/* display routes */
					this.directionsService.route({
						origin:origin,
						destination:destination,
						waypoints:waypoints,
						travelMode:google.maps.TravelMode.DRIVING
					},
					(result,status) => {
						if (status==google.maps.DirectionsStatus.OK)
						{
							/* append markers */
							for (var i=0;i<markers.length;i++) addmarker(markers[i],i);
							this.directionsRenderer.setDirections(result);
							this.directionsRenderer.setMap(this.map);
							if (callback) callback();
						}
					});
				}
				else
				{
					/* append markers */
					for (var i=0;i<markers.length;i++) addmarker(markers[i],i);
					/* setup center position */
					if (setupcenter) this.map.setCenter(new google.maps.LatLng(markers[0].lat,markers[0].lng));
					if (callback) callback();
				}
				break;
		}
	}
	/* search address */
	searchaddress(lat,lng,callback){
		this.geocoder.geocode({location:new google.maps.LatLng(lat,lng)},(results,status) => {
			switch (status)
			{
				case google.maps.GeocoderStatus.ZERO_RESULTS:
					break;
				case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
					tis.alert('リクエストが割り当て量を超えています');
					break;
				case google.maps.GeocoderStatus.REQUEST_DENIED:
					tis.alert('リクエストが拒否されました');
					break;
				case google.maps.GeocoderStatus.INVALID_REQUEST:
					tis.alert('クエリが不足しています');
					break;
				case 'OK':
					if (callback) callback(
						results[0].formatted_address.replace(/日本(,|、)[ ]*〒[0-9]{3}-[0-9]{4}[ ]*/g,''),
						((address_component) => {
							var filter=address_component.filter((item) => {
								return item.types.indexOf('postal_code')>-1;
							});
							return (filter.length!=0)?filter[0].long_name:'';
						})(results[0].address_components)
					);
					break;
			}
		});
	}
	/* search location */
	searchlocation(address,callback){
		this.geocoder.geocode({address:address,region:'jp'},(results,status) => {
			switch (status)
			{
				case google.maps.GeocoderStatus.ZERO_RESULTS:
					break;
				case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
					tis.alert('リクエストが割り当て量を超えています');
					break;
				case google.maps.GeocoderStatus.REQUEST_DENIED:
					tis.alert('リクエストが拒否されました');
					break;
				case google.maps.GeocoderStatus.INVALID_REQUEST:
					tis.alert('クエリが不足しています');
					break;
				case 'OK':
					if (callback) callback(results[0].geometry.location.lat(),results[0].geometry.location.lng());
					break;
			}
		});
	}
	/* watch location */
	watchlocation(continuous,callback){
		if (navigator.geolocation)
		{
			var userAgent=window.navigator.userAgent.toLowerCase();
			if (userAgent.indexOf('msie')!=-1 || userAgent.indexOf('trident')!=-1) alert('Internet Explorerでは正常に動作しません');
			this.watchaccuracy=Number.MAX_SAFE_INTEGER;
			this.watchstart=new Date();
			this.watchID=navigator.geolocation.watchPosition(
				(pos) => {
					if (continuous) callback(new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude));
					else
					{
						this.watchcurrent=new Date();
						if (this.watchaccuracy>pos.coords.accuracy) this.centerlocation=new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
						if (pos.coords.accuracy<300 || this.watchcurrent.getTime()-this.watchstart.getTime()>500)
						{
							callback(this.centerlocation);
							this.unwatchlocation();
						}
					}
				},
				(error) => {
					switch (error.code)
					{
						case 1:
							tis.alert('位置情報取得のアクセスが拒否されました<br>'+error.message);
							break;
						case 2:
							tis.alert('位置情報の取得に失敗しました<br>'+error.message);
							break;
					}
					this.unwatchlocation();
				},
				{
					enableHighAccuracy:true,
					maximumAge:0,
					timeout:500
				}
			);
		}
		else tis.alert('お使いのブラウザでは位置情報が取得出来ません');
	}
	/* clear watch location */
	unwatchlocation(){
		if (navigator.geolocation) navigator.geolocation.clearWatch(this.watchID);
		this.watchID=null;
	}
};
class tispanelizer{
	/* constructor */
	constructor(){
		var div=tis.create('div');
		/* initialize valiable */
		div.css({
			boxSizing:'border-box',
			position:'relative'
		});
		/* setup properties */
		this.cover=div.clone().css({
			backgroundColor:'rgba(0,0,0,0.5)',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999997'
		})
		.on('click',(e) => this.hide());
		this.container=div.clone().css({
			height:'100%',
			overflowX:'auto',
			overflowY:'hidden',
			padding:'1em 0.5em',
			textAlign:'center',
			verticalAlign:'middle',
			whiteSpace:'nowrap',
			width:'100%'
		});
		/* append elements */
		tis.elm('body')
		.append(
			this.cover
			.append(this.container)
		);
	}
	/* show images */
	show(elements){
		var img=tis.create('img');
		/* clear images */
		this.container.empty();
		/* create images */
		elements.some((item,index) => {
			if (item.tagName.toLowerCase()=='img')
				if (item.src)
					this.container.append(
						img.clone().css({
							boxSizing:'border-box',
							display:'inline-block',
							margin:'0px 0.5em',
							maxHeight:'100%',
							maxWidth:'calc(100% - 2em)',
							position:'relative',
							verticalAlign:'middle'
						})
						.attr('src',item.src)
						.on('click',(e) => this.hide())
					);
		});
		/* create elements for adjusting the height */
		this.container.append(
			tis.create('div').css({
				boxSizing:'border-box',
				display:'inline-block',
				height:'100%',
				verticalAlign:'middle',
				width:'0px'
			})
		);
		/* show */
		this.cover.css({display:'block',zIndex:tis.window.alert.cover.style.zIndex-2});
	}
	/* hide */
	hide(){
		this.cover.css({display:'none'});
	}
};
class tispopupwindow{
	/* constructor */
	constructor(innerElements,maxwidth,maxheight,callback){
		var div=tis.create('div');
		/* initialize valiable */
		div.css({
			boxSizing:'border-box',
			position:'relative'
		});
		/* setup properties */
		this.cover=div.clone().css({
			backgroundColor:'rgba(0,0,0,0.5)',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999996'
		});
		this.container=div.clone().css({
			backgroundColor:'#ffffff',
			borderRadius:'0.5em',
			bottom:'0',
			boxShadow:'0px 0px 3px rgba(0,0,0,0.35)',
			height:'calc(100% - 2em)',
			left:'0',
			margin:'auto',
			padding:'3em 0px 0.5em 0px',
			position:'absolute',
			right:'0',
			top:'0',
			width:'calc(100% - 2em)'
		});
		if (tis.isnumeric(maxwidth)) this.container.css({maxWidth:maxwidth+'px'});
		if (tis.isnumeric(maxheight)) this.container.css({maxHeight:maxheight+'px'});
		this.contents=div.clone().css({
			height:'100%',
			overflowX:'hidden',
			overflowY:'auto',
			padding:'0px 0.5em',
			textAlign:'center',
			width:'100%'
		});
		this.close=tis.create('img')
		.css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			cursor:'pointer',
			display:'block',
			height:'2em',
			margin:'0px',
			position:'absolute',
			right:'0.5em',
			top:'0.5em',
			width:'2em'
		})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9pJREFUeNpiYKAUMMIY/VMmvgdSAjB+YU4+WI4JSbFAQXYeA5KG/+gKGCZMncSArAhDAUyRm7MriCmI4gZkY0GSQDd8IMoXAAFEHf//RxL/ALRbkAldAuo1AQxvgSRA3kL3syDIn8gS6HaCjHqPHN54AUAAUceraMENdwISwAh6RmyaQJ7btXc3ik4kMbgh6CkAbBtMIyjoYEkGybD3OJMPephjS3M4/YyezNEAONqpEtoAATREEa5Egh5oWAMKW2j/x2UTeoJnwqYxMyUdRROMj24wzkQC04BuEDJgRrK1AUg5gNhnzp1lMDUyYbCxtGb4+/cvw/Q5M+EaPLw8GXdu23EAr80kA5CfQPjHjx9gjM4m2s8wpyI7mXZRhaTgA5bcxDh40jZAAI3mZmLToQMsF0DBAWBEHqC6xUCL1gOpABLM3QB0SCDZFpNhIdEOYMRjKUrhCSqJ2NnZGX7+/Ik1h+KRJ67QRYrD/biKRGQLCDkIChzR0wALDoUOhMol5BofvW2Ew7wDxBR8B/BVAiALQT4EWQiiQXx8lQI28wZXHA9oqh7QfEzLkmvkAYAAGkWjYNC1QAqQilNQkTiBZhZDG/31BJQ1Ah3RQBWLcXS5CQGCoyFMBCw1IMNScE8cqpc8i4HgPAXp5zxZFkPrY5ShAlERUZwGgeTQhxDQzSBoMTReMYYWosMjsVoOEgPJYQECULOI9vF6dIGlK5djtRzZUpgaQmbhsxijsff6zWsMy9EtBakhtuFIUv8a3XIiLCU7VWO1HHk0DMQm1VKyLAYFL3Q8FT4Ehy+1U8Vi9DjFleAosfgAIUtBwYstwRHbOcBlcSC2PIwtIaFbToxZOC2GFvAfsOVlbAkJ2XIsIy8fyOkf/6ekssc33EMocRlSYK/hoKyPB28LhFZtrlEw/AFAgPas6AZBIIZeiAM5gNG4gTH+KyM4gSPoBuq/MW5gNA7AJrCBXrEm98HJtQVE6Av9BO6l7bV91UehUHRfhQismlAxQfpcmi/St6chPZq3FJq1mjC2Bhvj35tzkGFPs2sFYRQ59taGDURkYi225JPGCWPIXhsiWkR8ygn5SBC66Y/IGvxviueo18Nlc4SrcMHm6XQ5kwQKmKwXs3m+ufqgZH8XPLOQCVuyK8xX0oFDiHPfQ0BeH+og/JR4qoiAkGjQ4M8diSFfttQU8BG6Pe5mMhqLibqcQ0rXgPBBVm2Fw8MG2SUO5uqBQqKk80WmZ6B4mNXmhYQ0GMiPQk9nemkJPZxf/1WXJV+OEz0ea+NRZS/NLVE1YE2dono3POh4qAJAxyQehUKh+Cu8AL45fzrg+n0KAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			this.hide();
			if (callback) callback();
		});
		/* append elements */
		tis.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(
					this.contents
					.append(innerElements.css({margin:'0px auto'}))
				)
				.append(this.close)
			)
		);
	}
	/* show */
	show(){
		this.cover.css({display:'block',zIndex:tis.window.alert.cover.style.zIndex-3});
	}
	/* hide */
	hide(){
		this.cover.css({display:'none'});
	}
};
class tisresourcemanager{
	/* constructor */
	constructor(){
		var div=tis.create('div');
		var img=tis.create('img');
		/* initialize valiable */
		div.css({
			boxSizing:'border-box',
			position:'relative'
		});
		img.css({
			backgroundColor:'transparent',
			border:'none',
			boxSizing:'border-box',
			cursor:'pointer',
			display:'inline-block',
			height:'2em',
			margin:'0px',
			verticalAlign:'top',
			width:'2em'
		})
		/* setup properties */
		this.url='';
		this.directory='';
		this.callback='';
		this.cover=div.clone().css({
			backgroundColor:'rgba(0,0,0,0.5)',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999997'
		});
		this.container=div.clone().css({
			backgroundColor:'#ffffff',
			borderRadius:'0.5em',
			bottom:'0',
			boxShadow:'0px 0px 3px rgba(0,0,0,0.35)',
			height:'calc(100% - 2em)',
			left:'0',
			margin:'auto',
			padding:'3em 0px 0.5em 0px',
			position:'absolute',
			right:'0',
			top:'0',
			width:'calc(100% - 2em)'
		});
		this.contents=div.clone().css({
			height:'100%',
			overflowX:'hidden',
			overflowY:'auto',
			padding:'0px 0.5em',
			textAlign:'center',
			width:'100%'
		});
		this.close=img.clone().css({
			position:'absolute',
			right:'0.5em',
			top:'0.5em'
		})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9pJREFUeNpiYKAUMMIY/VMmvgdSAjB+YU4+WI4JSbFAQXYeA5KG/+gKGCZMncSArAhDAUyRm7MriCmI4gZkY0GSQDd8IMoXAAFEHf//RxL/ALRbkAldAuo1AQxvgSRA3kL3syDIn8gS6HaCjHqPHN54AUAAUceraMENdwISwAh6RmyaQJ7btXc3ik4kMbgh6CkAbBtMIyjoYEkGybD3OJMPephjS3M4/YyezNEAONqpEtoAATREEa5Egh5oWAMKW2j/x2UTeoJnwqYxMyUdRROMj24wzkQC04BuEDJgRrK1AUg5gNhnzp1lMDUyYbCxtGb4+/cvw/Q5M+EaPLw8GXdu23EAr80kA5CfQPjHjx9gjM4m2s8wpyI7mXZRhaTgA5bcxDh40jZAAI3mZmLToQMsF0DBAWBEHqC6xUCL1gOpABLM3QB0SCDZFpNhIdEOYMRjKUrhCSqJ2NnZGX7+/Ik1h+KRJ67QRYrD/biKRGQLCDkIChzR0wALDoUOhMol5BofvW2Ew7wDxBR8B/BVAiALQT4EWQiiQXx8lQI28wZXHA9oqh7QfEzLkmvkAYAAGkWjYNC1QAqQilNQkTiBZhZDG/31BJQ1Ah3RQBWLcXS5CQGCoyFMBCw1IMNScE8cqpc8i4HgPAXp5zxZFkPrY5ShAlERUZwGgeTQhxDQzSBoMTReMYYWosMjsVoOEgPJYQECULOI9vF6dIGlK5djtRzZUpgaQmbhsxijsff6zWsMy9EtBakhtuFIUv8a3XIiLCU7VWO1HHk0DMQm1VKyLAYFL3Q8FT4Ehy+1U8Vi9DjFleAosfgAIUtBwYstwRHbOcBlcSC2PIwtIaFbToxZOC2GFvAfsOVlbAkJ2XIsIy8fyOkf/6ekssc33EMocRlSYK/hoKyPB28LhFZtrlEw/AFAgPas6AZBIIZeiAM5gNG4gTH+KyM4gSPoBuq/MW5gNA7AJrCBXrEm98HJtQVE6Av9BO6l7bV91UehUHRfhQismlAxQfpcmi/St6chPZq3FJq1mjC2Bhvj35tzkGFPs2sFYRQ59taGDURkYi225JPGCWPIXhsiWkR8ygn5SBC66Y/IGvxviueo18Nlc4SrcMHm6XQ5kwQKmKwXs3m+ufqgZH8XPLOQCVuyK8xX0oFDiHPfQ0BeH+og/JR4qoiAkGjQ4M8diSFfttQU8BG6Pe5mMhqLibqcQ0rXgPBBVm2Fw8MG2SUO5uqBQqKk80WmZ6B4mNXmhYQ0GMiPQk9nemkJPZxf/1WXJV+OEz0ea+NRZS/NLVE1YE2dono3POh4qAJAxyQehUKh+Cu8AL45fzrg+n0KAAAAAElFTkSuQmCC')
		.on('click',(e) => this.hide());
		this.thumbnail=div.clone().css({
			display:'inline-block',
			maxWidth:'300px',
			margin:'0px',
			padding:'0.25em',
			verticalAlign:'top',
			width:'50%'
		})
		.append(
			img.clone().css({
				position:'absolute',
				right:'0.5em',
				top:'0.5em',
				zIndex:'2'
			})
			.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9pJREFUeNpiYKAUMMIY/VMmvgdSAjB+YU4+WI4JSbFAQXYeA5KG/+gKGCZMncSArAhDAUyRm7MriCmI4gZkY0GSQDd8IMoXAAFEHf//RxL/ALRbkAldAuo1AQxvgSRA3kL3syDIn8gS6HaCjHqPHN54AUAAUceraMENdwISwAh6RmyaQJ7btXc3ik4kMbgh6CkAbBtMIyjoYEkGybD3OJMPephjS3M4/YyezNEAONqpEtoAATREEa5Egh5oWAMKW2j/x2UTeoJnwqYxMyUdRROMj24wzkQC04BuEDJgRrK1AUg5gNhnzp1lMDUyYbCxtGb4+/cvw/Q5M+EaPLw8GXdu23EAr80kA5CfQPjHjx9gjM4m2s8wpyI7mXZRhaTgA5bcxDh40jZAAI3mZmLToQMsF0DBAWBEHqC6xUCL1gOpABLM3QB0SCDZFpNhIdEOYMRjKUrhCSqJ2NnZGX7+/Ik1h+KRJ67QRYrD/biKRGQLCDkIChzR0wALDoUOhMol5BofvW2Ew7wDxBR8B/BVAiALQT4EWQiiQXx8lQI28wZXHA9oqh7QfEzLkmvkAYAAGkWjYNC1QAqQilNQkTiBZhZDG/31BJQ1Ah3RQBWLcXS5CQGCoyFMBCw1IMNScE8cqpc8i4HgPAXp5zxZFkPrY5ShAlERUZwGgeTQhxDQzSBoMTReMYYWosMjsVoOEgPJYQECULOI9vF6dIGlK5djtRzZUpgaQmbhsxijsff6zWsMy9EtBakhtuFIUv8a3XIiLCU7VWO1HHk0DMQm1VKyLAYFL3Q8FT4Ehy+1U8Vi9DjFleAosfgAIUtBwYstwRHbOcBlcSC2PIwtIaFbToxZOC2GFvAfsOVlbAkJ2XIsIy8fyOkf/6ekssc33EMocRlSYK/hoKyPB28LhFZtrlEw/AFAgPas6AZBIIZeiAM5gNG4gTH+KyM4gSPoBuq/MW5gNA7AJrCBXrEm98HJtQVE6Av9BO6l7bV91UehUHRfhQismlAxQfpcmi/St6chPZq3FJq1mjC2Bhvj35tzkGFPs2sFYRQ59taGDURkYi225JPGCWPIXhsiWkR8ygn5SBC66Y/IGvxviueo18Nlc4SrcMHm6XQ5kwQKmKwXs3m+ufqgZH8XPLOQCVuyK8xX0oFDiHPfQ0BeH+og/JR4qoiAkGjQ4M8diSFfttQU8BG6Pe5mMhqLibqcQ0rXgPBBVm2Fw8MG2SUO5uqBQqKk80WmZ6B4mNXmhYQ0GMiPQk9nemkJPZxf/1WXJV+OEz0ea+NRZS/NLVE1YE2dono3POh4qAJAxyQehUKh+Cu8AL45fzrg+n0KAAAAAElFTkSuQmCC')
		)
		.append(
			div.clone().css({
				backgroundPosition:'center center',
				backgroundRepeat:'no-repeat',
				backgroundSize:'contain',
				height:'0px',
				margin:'0px',
				padding:'100% 0px 0px 0px',
				width:'100%',
				zIndex:'1'
			}).addclass('thumbnail')
			.append(
				div.clone().css({
					height:'100%',
					left:'0px',
					overflow:'hidden',
					position:'absolute',
					top:'0px',
					width:'100%'
				})
			)
		)
		.append(
			tis.create('span').css({
				display:'inline-block',
				textAlign:'center',
				width:'100%'
			})
		);
		/* append elements */
		tis.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(
					this.contents
					.append(
						tis.create('span').css({
							cursor:'pointer',
							display:'block',
							paddingBottom:'0.5em'
						})
						.append(
							img.clone()
							.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA71JREFUeNpiYKAUMMIYTku/vgdSAjD+vmhusBwTkmKwpL44M0zDf3QFYEkVAUa4IhBgQVZw8eVfIMkMpRkEUdyAbCxIEuiGD0T5AiCAqOP//0jiH4B2CzIhSyB5SQDF3/j8LAj053sk/2LYCTLqPXJ44wUAAUQdr6IFN9wJSAAj6BnxaYL5HNmTyIawoJn+HlkTKOggAMWQ9zBLWbA5G2ETVptx+xk9maMBcLRTJbQBAmiIIlyJBD3QsAYUttD+j8sm9ATPhE/j3iguvAYzUeJnJiRTG5DTNCyJIrPR1TFRLbSx+dl52TecgcZE1XgmO6qQFHzAkpsYB0/aBgig0dxMFACmBAcg5YAkdAAYkQeobjHQov1oFhECG4AOCSTbYkIWxuuyMiy8/JssBzDhsfQ9PktBBUsc0GLkAgYLCICaQ5zF0DgUoFI6EoCahwJYcCh2QA9SkO+wgT5ndgyxRcDgR4sCkHkHiLEYpKgexlmIaRA4iEGWFu39ibPFgGYe4aCGZg1qNVQ/YMtqTHhKZkFsLkVuJ4GClIBvN+Bq9hCbj9eDUijd8jEtS66RBwACaBSNgkHXAilAqr1AReIEmlkMbczXE1DWCHREA1UsxtHlJgQIjoYwEbDUgAxLwT1xqF7yLAaC8/iaPgSaPefJCmoCvXx4dxK9e0XsaAATnnilRptLAGoW0UG9nopZdj4pFjtQ0WKsDQgWYnQqCzIx8LAx4kxkyODLr/8Md9//I2gmURbP8uTAKYeteUsgwRFvcdr2Hxg+hlkIat4ig5df/hEV/kRZjC/oiGhTk1SAULPhtoEUiwOpaHEi0RZDC3hq9CQ+4KosCPWP/+MrqwnFMb7hHkKJyxBXYU9EolIclPXx4G2B0KrNNQqGPwAI0K4V3DAIw8AUdQBGYYVO0BHajsAElAkYgXYEJmAFRukIjVVXQqhEtkkiU/kEDx4gX2KUu0vsMhgM/59CEFfNEp3LhemGQNw+3ScKfakmjNKgcfE2FBzq3DaWzDhEIFmh+a0ydOQEzsCTn7ITxpYdMxH9RfwkafktqraTvAuhwtzfg+WmBAcrqLmtXgjI3qVkAcs8YS1RIaKbH5OITth//EowTbnRYF1JZrhXurz20Qnjf6sW1PqOjG8G19bv1jUX1HcIW+JlipbePTgzHFzzYPQp8fCyE4iHGTbXx55h7QkStT5uS9+U8iXXVTBH8QFCXhnZFutKo7Qwia2l1cEeVOhZIC1ZSsvMg9lDCwBYLQ8Rz9kxT7n5e3CJIh6DwWDYFd5FmIjBi3z+mAAAAABJRU5ErkJggg==')
						)
						.append(
							tis.create('span').css({
								lineHeight:'2em',
								padding:'0px 0.25em',
								verticalAlign:'top'
							})
							.html('リソース追加')
						)
						.on('click',(e) => this.contents.elm('input').click())
					)
					.append(
						tis.create('input').attr('type','file')
						.on('change',(e) => {
							if (e.currentTarget.files)
							{
								tis.file(this.url,'POST',{'X-Requested-With':'XMLHttpRequest'},{name:'file',dir:this.directory.replace(/^\.+\//g,''),files:e.currentTarget.files})
								.then((resp) => {
									var files=JSON.parse(resp).files;
									for (var i=0;i<files.length;i++) this.contents.elm('.resources').insertBefore(this.create(files[i]),this.contents.elm('.resources').firstChild);
								})
								.catch((error) => tis.alert(error.message));
							}
						})
					)
					.append(div.clone().css({width:'100%'}).addclass('resources'))
				)
				.append(this.close)
			)
		);
	}
	/* create thumbnail */
	create(file){
		var res=this.thumbnail.clone().on('click',(e) => {
			if (this.callback) this.callback(file);
		});
		res.elm('img').on('click',(e) => {
			var thumbnail=e.currentTarget.closest('div');
			tis.confirm('削除します',() => {
				tis.file(this.url,'DELETE',{'X-Requested-With':'XMLHttpRequest'},{name:thumbnail.elm('span').text(),dir:this.directory.replace(/^\.+\//g,'')})
				.then((resp) => this.contents.elm('.resources').removeChild(thumbnail))
				.catch((error) => tis.alert(error.message));
			});
			e.stopPropagation();
			e.preventDefault();
		})
		tis.file(this.url,'GET',{'X-Requested-With':'XMLHttpRequest'},{dir:this.directory.replace(/^\.+\//g,''),name:file,type:true})
		.then((resp) => {
			res.elm('.thumbnail').css({
				backgroundImage:((type) => {
					var res='';
					switch (type)
					{
						case 'text/plain':
							res='url(data:image/png;base64,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)';
							break;
						case 'text/csv':
							res='url(data:image/png;base64,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)';
							break;
						case 'text/html':
							res='url(data:image/png;base64,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)';
							break;
						case 'text/css':
							res='url(data:image/png;base64,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)';
							break;
						case 'text/javascript':
							res='url(data:image/png;base64,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)';
							break;
						case 'application/octet-stream':
							res='url(data:image/png;base64,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)';
							break;
						case 'application/pdf':
							res='url(data:image/png;base64,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)';
							break;
						case 'application/vnd.ms-excel':
						case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
							res='url(data:image/png;base64,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)';
							break;
						case 'application/vnd.ms-powerpoint':
						case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
							res='url(data:image/png;base64,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)';
							break;
						case 'application/msword':
						case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
							res='url(data:image/png;base64,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)';
							break;
						case 'application/zip':
						case 'application/x-lzh':
						case 'application/x-tar':
							res='url(data:image/png;base64,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)';
							break;
						case 'audio/mpeg':
						case 'audio/mp4':
						case 'video/mpeg':
							res='url(data:image/png;base64,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)';
							break;
						case 'image/bmp':
						case 'image/gif':
						case 'image/jpeg':
						case 'image/png':
							res='url("'+this.directory+file+'")';
							break;
						default:
							res='url(data:image/png;base64,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)';
							break;
					}
					return res;
				})(JSON.parse(resp).type)
			})
		})
		.catch((error) => tis.alert(error.message));
		res.elm('span').text(file);
		return res;
	}
	/* show */
	show(url,directory,callback){
		/* setup properties */
		this.url=url;
		this.directory=directory;
		this.callback=callback;
		/* get resources */
		tis.file(this.url,'GET',{'X-Requested-With':'XMLHttpRequest'},{dir:this.directory.replace(/^\.+\//g,'')})
		.then((resp) => {
			var files=JSON.parse(resp).files;
			this.contents.elm('.resources').empty();
			for (var i=0;i<files.length;i++) this.contents.elm('.resources').append(this.create(files[i]));
		})
		.catch((error) => tis.alert(error.message));
		this.cover.css({display:'block',zIndex:tis.window.alert.cover.style.zIndex-2});
	}
	/* hide */
	hide(){
		this.cover.css({display:'none'});
	}
};
class tisloader{
	/* constructor */
	constructor(){
		var span=tis.create('span');
		var keyframes={};
		var vendors=['-webkit-',''];
		/* initialize valiable */
		keyframes['0%']={
			'transform':'translateY(0);'
		};
		keyframes['25%']={
			'transform':'translateY(0);'
		};
		keyframes['50%']={
			'transform':'translateY(-0.5em);'
		};
		keyframes['100%']={
			'transform':'translateY(0);'
		};
		span.css({
			color:'#ffffff',
			display:'inline-block',
			lineHeight:'2em',
			padding:'0px 1px',
			verticalAlign:'top',
			WebkitAnimationName:'loading',
			WebkitAnimationDuration:'1s',
			WebkitAnimationTimingFunction:'ease-out',
			WebkitAnimationIterationCount:'infinite',
			animationName:'loading',
			animationDuration:'1s',
			animationTimingFunction:'ease-out',
			animationIterationCount:'infinite'
		});
		/* setup properties */
		this.cover=tis.create('div').css({
			backgroundColor:'rgba(0,0,0,0.5)',
			boxSizing:'border-box',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999998'
		});
		this.container=tis.create('p').css({
			bottom:'0',
			fontSize:'0.8em',
			height:'2em',
			left:'0',
			margin:'auto',
			maxHeight:'100%',
			maxWidth:'100%',
			overflow:'hidden',
			padding:'0px',
			position:'absolute',
			right:'0',
			textAlign:'center',
			top:'0',
			width:'100%'
		});
		/* append styles */
		tis.elm('head').append(
			tis.create('style')
			.attr('media','screen')
			.attr('type','text/css')
			.text(
				((vendors,keyframes) => {
					var res='';
					for (var i=0;i<vendors.length;i++)
						res+='@'+vendors[i]+'keyframes loading'+JSON.stringify(keyframes).replace(/:{/g,'{').replace(/[,"]/g,'')+' '
					return res.replace(/[ ]+$/g,'')
				})(vendors,keyframes)
			)
		);
		/* append elements */
		tis.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(
					tis.create('span').css({
						color:'#ffffff',
						display:'inline-block',
						lineHeight:'2em',
						paddingRight:'0.25em',
						verticalAlign:'top'
					})
					.html('Please wait a moment')
				)
				.append(span.clone().css({animationDelay:'0s'}).html('.'))
				.append(span.clone().css({animationDelay:'0.1s'}).html('.'))
				.append(span.clone().css({animationDelay:'0.2s'}).html('.'))
				.append(span.clone().css({animationDelay:'0.3s'}).html('.'))
				.append(span.clone().css({animationDelay:'0.4s'}).html('.'))
			)
		);
	}
	/* show */
	show(){
		this.cover.css({display:'block',zIndex:tis.window.alert.cover.style.zIndex-1});
	}
	/* hide */
	hide(){
		this.cover.css({display:'none'});
	}
};
var tis=new tislibrary();
/*
DOM extention
*/
HTMLDocument.prototype.off=function(type,listener){
	var types=(Array.isArray(type))?type:type.split(',');
	for (var i=0;i<types.length;i++)
	{
		if (listener) this.removeEventListener(types[i],listener);
		else
		{
			if (this in tis.eventlisteners)
				if (types[i] in tis.eventlisteners[this])
				{
					for (var i2=0;i2<tis.eventlisteners[this][types[i]].length;i2++)
						this.removeEventListener(types[i],tis.eventlisteners[this][types[i]][i2]);
				}
		}
	}
	return this;
}
HTMLDocument.prototype.on=function(type,listener){
	var types=(Array.isArray(type))?type:type.split(',');
	for (var i=0;i<types.length;i++)
	{
		if (!(this in tis.eventlisteners)) tis.eventlisteners[this]={};
		if (!(types[i] in tis.eventlisteners[this])) tis.eventlisteners[this][types[i]]=[];
		tis.eventlisteners[this][types[i]].push(listener);
		this.addEventListener(types[i],listener);
	}
	return this;
}
HTMLElement.prototype.addclass=function(className){
	var classes=className.split(' ');
	for (var i=0;i<classes.length;i++)
		if (classes[i]) this.classList.add(classes[i]);
	return this;
}
HTMLElement.prototype.append=function(element){
	this.appendChild(element);
	return this;
}
HTMLElement.prototype.attr=function(name,value){
	if (typeof value!=='undefined')
	{
		this.setAttribute(name,value);
		return this;
	}
	else return this.getAttribute(name);
}
HTMLElement.prototype.clone=function(){
	var clone=this.cloneNode(true);
	if (this.tagName.toLowerCase()=='select') clone.value=this.value;
	else clone.elms('select').some((item,index) => {item.value=this.elms('select')[index].value});
	return clone;
}
HTMLElement.prototype.closest=function(selectors){
	var search=(element) => {
		if (!(element.parentNode instanceof HTMLDocument))
		{
			if (element.parentNode.matches(selectors)) return element.parentNode;
			else return search(element.parentNode);
		}
		else return null;
	};
	return search(this);
}
HTMLElement.prototype.css=function(properties){
	if (typeof properties!=='string')
	{
		for (var key in properties) this.style[key]=properties[key];
		return this;
	}
	else return (this.currentStyle)?this.currentStyle[properties]:document.defaultView.getComputedStyle(this,null).getPropertyValue(properties);
}
HTMLElement.prototype.elm=function(selectors){
	return this.querySelector(selectors);
}
HTMLElement.prototype.elms=function(selectors){
	return Array.from(this.querySelectorAll(selectors));
}
HTMLElement.prototype.empty=function(){
	this.innerHTML='';
	return this;
}
HTMLElement.prototype.hasclass=function(className){
	return this.classList.contains(className);
}
HTMLElement.prototype.hide=function(){
	return this.css({display:'none'});
}
HTMLElement.prototype.html=function(value){
	if (typeof value!=='undefined')
	{
		this.innerHTML=value;
		return this;
	}
	else return this.innerHTML;
}
HTMLElement.prototype.innerheight=function(){
	var paddingTop=this.css('padding-top');
	var paddingBottom=this.css('padding-bottom');
	if (!paddingTop) paddingTop='0';
	if (!paddingBottom) paddingBottom='0';
	return this.clientHeight-parseFloat(paddingTop)-parseFloat(paddingBottom);
}
HTMLElement.prototype.innerwidth=function(){
	var paddingLeft=this.css('padding-left');
	var paddingRight=this.css('padding-right');
	if (!paddingLeft) paddingLeft='0';
	if (!paddingRight) paddingRight='0';
	return this.clientWidth-parseFloat(paddingLeft)-parseFloat(paddingRight);
}
HTMLElement.prototype.initialize=function(){
	this.alert=tis.create('div').css({
		display:'none',
		position:'absolute',
		margin:'-0.5em 0px 0px 0px',
		transition:'none',
		zIndex:tis.window.alert.cover.style.zIndex-4
	})
	.append(
		tis.create('img').css({
			display:'block',
			height:'0.75em',
			margin:'0px 0px 0px 1.5em',
			position:'relative',
			width:'0.75em'
		})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkVGNzA3QTE1RTc4MTFFOEI5MDA5RUE2NDFCQTUzNDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkVGNzA3QTI1RTc4MTFFOEI5MDA5RUE2NDFCQTUzNDciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCRUY3MDc5RjVFNzgxMUU4QjkwMDlFQTY0MUJBNTM0NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCRUY3MDdBMDVFNzgxMUU4QjkwMDlFQTY0MUJBNTM0NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkBlNTAAAADNSURBVHja7NHBCcJAFATQZNBcYwmSmycPlpI2bCVgAVqAVmAFHmxqncAKQVyz+/N/grADc0iyy0Be6ZwrlgiKhZKH83Ae/v/h1X23l9499vfZk2hYOHpgO7ZkH+xzjl9dsze2Ytfsld3MMXxhm8Hzlj1bD/eu7Zf3rf9mMvx2DaXzZ1SHh66hVP5MrTn86RpK48+qDIdcQ4nyxkRXsTcmuoq9oeAq8oaSa7I3FF2TvKHomuQNZddobxi4RnnDyHXUG0auo94wdP3p/RJgAMw4In5GE/6/AAAAAElFTkSuQmCC')
	)
	.append(
		tis.create('span').css({
			backgroundColor:'#b7282e',
			borderRadius:'0.5em',
			color:'#ffffff',
			display:'block',
			lineHeight:'2em',
			margin:'0px',
			padding:'0px 0.5em',
			position:'relative'
		})
	);
	var chase=(message) => {
		var elementrect=this.getBoundingClientRect();
		var parentrect=this.parentNode.getBoundingClientRect();
		this.alert.css({
			left:(elementrect.left-parentrect.left).toString()+'px',
			top:(elementrect.top-parentrect.top+elementrect.height).toString()+'px'
		});
		if (message) this.alert.elm('span').html(message);
		return this.alert;
	};
	var transition=(e) => {
		var code=e.keyCode||e.which;
		if (code==13)
		{
			var elements=tis.elms('button,input,select,textarea').filter((element) => {
				var exists=0;
				if (element.visible())
				{
					if (element.hasAttribute('tabindex'))
						if (element.attr('tabindex')=='-1') exists++;
					if (element.tagName.toLowerCase()=='input')
						if (element.type.toLowerCase().match(/(color|file)/g)) exists++;
				}
				else exists++;
				return exists==0;
			});
			var total=elements.length;
			var index=elements.indexOf(e.currentTarget)+(e.shiftKey?-1:1);
			elements[(index<0)?total-1:((index>total-1)?0:index)].focus();
			e.stopPropagation();
			e.preventDefault();
			return false;
		}
	};
	/* setup focus transition */
	switch (this.tagName.toLowerCase())
	{
		case 'input':
			switch (this.type.toLowerCase())
			{
				case 'button':
				case 'color':
				case 'file':
				case 'image':
				case 'reset':
					break;
				case 'radio':
					if (this.hasAttribute('data-name'))
					{
						if (this.closest('.data-field'))
						{
							((container) => {
								this.closest('label').on('click',(e) => {
									((value) => {
										container.elms('[data-name='+this.attr('data-name')+']').some((item,index) => {
											item.checked=(value==item.val());
										});
									})(this.val());
								});
							})(this.closest('.data-field'));
						}
					}
					break;
				default:
					this
					.on('keydown',transition)
					.on('focus',(e) => this.beforevalue=e.currentTarget.val())
					.on('blur',(e) => {
						if (e.currentTarget.hasAttribute('data-padding'))
						{
							var param=e.currentTarget.attr('data-padding').split(':');
							var value=e.currentTarget.val();
							if (param.length==3)
							{
								if (value===undefined || value===null) value='';
								if (param[2]=='L') e.currentTarget.val(value.toString().lpad(param[0],param[1]));
								else  e.currentTarget.val(value.toString().rpad(param[0],param[1]));
							}
						}
					});
					break;
			}
			break;
		case 'select':
			this
			.on('keydown',transition)
			.on('focus',(e) => this.beforevalue=e.currentTarget.val());
			break;
	}
	/* setup required */
	if (this.hasAttribute('required'))
	{
		var placeholder=this.attr('placeholder');
		if (placeholder) placeholder=placeholder.replace('*必須項目','')
		this.attr('placeholder','*必須項目'+((placeholder)?' '+placeholder:''));
	}
	/* setup validation */
	if (this.hasAttribute('data-type'))
		switch (this.attr('data-type'))
		{
			case 'alphabet':
				this.attr('pattern','^[A-Za-z!"#$%&\'()*,\\-.\\/:;<>?@\\[\\\\\\]\\^_`{|}~ ]+$');
				break;
			case 'alphanum':
				this.attr('pattern','^[0-9A-Za-z!"#$%&\'()*,\\-.\\/:;<>?@\\[\\\\\\]\\^_`{|}~ ]+$');
				break;
			case 'color':
				this.attr('pattern','^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$');
				break;
			case 'date':
				this.attr('pattern','^[1-9][0-9]{3}[\\-.\\/]+([1-9]{1}|0[1-9]{1}|1[0-2]{1})[\\-.\\/]+([1-9]{1}|[0-2]{1}[0-9]{1}|3[01]{1})$')
				.on('focus',(e) => e.currentTarget.val(e.currentTarget.val().replace(/[^0-9]+/g,'')))
				.on('blur',(e) => {
					var value=e.currentTarget.val().replace(/[^0-9]+/g,'');
					if (value.length==8) e.currentTarget.val(value.substr(0,4)+'-'+value.substr(4,2)+'-'+value.substr(6,2));
				});
				break;
			case 'datetime':
				this.attr('pattern','^[1-9][0-9]{3}[\\-.\\/]+([1-9]{1}|0[1-9]{1}|1[0-2]{1})[\\-.\\/]+([1-9]{1}|[0-2]{1}[0-9]{1}|3[01]{1}) [0-9]{1,2}:[0-9]{1,2}$');
				break;
			case 'mail':
				this.attr('pattern','^[0-9A-Za-z]+[0-9A-Za-z._-]*@[0-9A-Za-z]+[0-9A-Za-z._-]*\\.[a-z]+$');
				break;
			case 'number':
				this.attr('pattern','^[0-9,\\-.]+$')
				.css({textAlign:'right'})
				.on('focus',(e) => e.currentTarget.val(e.currentTarget.val().replace(/[^-0-9.]+/g,'')))
				.on('blur',(e) => {
					var value=e.currentTarget.val().replace(/[^-0-9.]+/g,'');
					if (value) e.currentTarget.val(Number(value).comma(this.attr('data-digit')));
				});
				break;
			case 'nondemiliternumber':
				this.attr('pattern','^[0-9\\-.]+$').css({textAlign:'right'});
				break;
			case 'postalcode':
				this.attr('pattern','^[0-9]{3}-?[0-9]{4}$')
				.on('focus',(e) => e.currentTarget.val(e.currentTarget.val().replace(/[^0-9]+/g,'')))
				.on('blur',(e) => {
					var value=e.currentTarget.val().replace(/[^0-9]+/g,'');
					if (value.length==7) e.currentTarget.val(value.substr(0,3)+'-'+value.substr(3,4));
				});
				break;
			case 'tel':
				this.attr('pattern','^0[0-9]{1,3}-?[0-9]{2,4}-?[0-9]{3,4}$');
				break;
			case 'time':
				this.attr('pattern','^[0-9]{1,2}:[0-9]{1,2}$');
				break;
			case 'url':
				this.attr('pattern','^https?:\\/\\/[0-9A-Za-z!"#$%&\'()*,\\-.\\/:;<>?@\\[\\\\\\]\\^_`{|}~=]+$');
				break;
			case 'urldirectory':
				this.attr('pattern','^[0-9a-z\\-_.!\']+$');
				break;
		}
	/* append elements */
	this.parentNode.append(chase());
	/* resize scroll event */
	window.on('resize,scroll',(e) => chase());
	/* validation event */
	return this.on('invalid',(e) => {
		/* validate required */
		if (e.currentTarget.validity.valueMissing) chase('必須項目です').show();
		/* validate pattern */
		if (e.currentTarget.validity.patternMismatch) chase('入力内容を確認して下さい').show();
		/* validate type */
		if (e.currentTarget.validity.typeMismatch) chase('入力内容を確認して下さい').show();
	}).on('focus',(e) => this.alert.hide());
}
HTMLElement.prototype.isempty=function(){
	var exists=false;
	this.elms('input,select,textarea').some((item,index) => {
		switch (item.tagName.toLowerCase())
		{
			case 'input':
				switch (item.type.toLowerCase())
				{
					case 'button':
					case 'image':
					case 'radio':
					case 'reset':
						break;
					case 'checkbox':
						if (!exists) exists=item.checked;
						break;
					case 'color':
						if (!exists) exists=(item.val()!='#000000');
						break;
					case 'range':
						var max=(item.max)?parseFloat(item.max):100;
						var min=(item.min)?parseFloat(item.min):0;
						if (!exists) exists=(item.val()!=(max-min)/2);
						break;
					default:
						if (!exists) exists=(item.val());
						break;
				}
				break;
			case 'select':
				if (!exists) exists=(item.selectedIndex);
				break;
			default:
				if (!exists) exists=(item.val());
				break;
		}
	});
	return !exists;
}
HTMLElement.prototype.off=function(type,listener){
	var types=type.split(',');
	for (var i=0;i<types.length;i++)
	{
		if (listener) this.removeEventListener(types[i],listener);
		else
		{
			if (this in tis.eventlisteners)
				if (types[i] in tis.eventlisteners[this])
				{
					for (var i2=0;i2<tis.eventlisteners[this][types[i]].length;i2++)
						this.removeEventListener(types[i],tis.eventlisteners[this][types[i]][i2]);
				}
		}
	}
	return this;
}
HTMLElement.prototype.on=function(type,listener){
	var types=type.split(',');
	for (var i=0;i<types.length;i++)
	{
		if (!(this in tis.eventlisteners)) tis.eventlisteners[this]={};
		if (!(types[i] in tis.eventlisteners[this])) tis.eventlisteners[this][types[i]]=[];
		tis.eventlisteners[this][types[i]].push(listener);
		this.addEventListener(types[i],listener);
	}
	return this;
}
HTMLElement.prototype.outerheight=function(includemargin){
	if (includemargin)
	{
		var marginTop=this.css('margin-top');
		var marginBottom=this.css('margin-bottom');
		if (!marginTop) marginTop='0';
		if (!marginBottom) marginBottom='0';
		return this.offsetHeight+parseFloat(marginTop)+parseFloat(marginBottom);
	}
	return this.offsetHeight;
}
HTMLElement.prototype.outerwidth=function(includemargin){
	if (includemargin)
	{
		var marginLeft=this.css('margin-left');
		var marginRight=this.css('margin-right');
		if (!marginLeft) marginLeft='0';
		if (!marginRight) marginRight='0';
		return this.offsetWidth+parseFloat(marginLeft)+parseFloat(marginRight);
	}
	return this.offsetWidth;
}
HTMLElement.prototype.pager=function(offset,limit,records,total,callback){
	var error=false;
	var img=tis.create('img').css({
		backgroundColor:'transparent',
		border:'none',
		boxSizing:'border-box',
		cursor:'pointer',
		display:'inline-block',
		height:'2em',
		position:'relative',
		width:'2em'
	});
	var span=tis.create('span').css({
		display:'inline-block',
		lineHeight:'2em',
		padding:'0px 0.25em',
		verticalAlign:'top'
	});
	if (!tis.isnumeric(offset)) error=true;
	if (!tis.isnumeric(limit)) error=true;
	if (!tis.isnumeric(records)) error=true;
	if (!tis.isnumeric(total)) error=true;
	if (!error)
	{
		this.empty();
		if (parseInt(offset)>0)
		{
			this.append(
				img.clone()
				.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjZJREFUeNpiYKAJ6J8y8T+MzYIm0QCk6pHFmNA016ObhqKgMCefkfoOBggg6vr9Psz/LLgCBcVb6BI4gxSvQqJMAQggugYDinNYSNVAUDOxHmbCJghNRo2ENDMSG+VASoGq6RMggIY7Agbae6Limdh4ZyGgaT2QCiAphRGbyliwaALZtJ7s5EksYCTF2ehJE6fNUIUbqFIIUFQuYUskAwcAAmgUUTP3F5CUpSi0DD07TqCZxUDLQBXBfVL1sZBpmQCQoiiPsJCRIQWoES3ENAn2AykHaic+Rlr6GF8DgJGWcUx1i4lN1TS1GF8+HpC2FqGSa+QBgAAaRaNgFBBVcJDVm6BCL4uo2ouFShYaAKnzNG/6oFkKstCALm0uarS7mMi0tJ+ujT1i+79UtRhav/ZTKwewUDubULN5S5MRO4KJC9pu+kB3i6GWC4KoAWvQkxL0hFqYJOdjqIET6BLUWCwHBbsg3S2GWv4B6vsLdLUYyQGGQMqQ5omL2IKG6omL3tluFIwCkgFAgPbN6AZAGASi1XQQR3BD3aSrGhLilzZqoQK9iwu8RLnrUfFAEORKbla63NNSRbq21KPZOCQFqJIqC133wAxJt2FU+uZsCHRPF9d+QgFzq7FJlwymgHk/U3pCdgfmgpMm7PL3p5MVIU8bsTQUpbtxcRsxB6xtI9Ka02CaPL7SLdFSLUtrDi2TwJq2ZB5YOni4ApaIlm6Bvx4eQgC/8fVQwE9sLizwnc3hbwMIgobRAdIK28oCHbudAAAAAElFTkSuQmCC')
				.on('click',(e) => {
					if (callback) callback(parseInt(offset)-parseInt(limit));
				})
			);
		}
		this.append(span.clone().html((parseInt(offset)+1).comma()));
		this.append(span.clone().html('-'));
		this.append(span.clone().html((parseInt(offset)+parseInt(records)).comma()));
		this.append(span.clone().html('in'));
		this.append(span.clone().html(parseInt(total).comma()));
		if (parseInt(offset)+parseInt(records)<total)
		{
			this.append(
				img.clone()
				.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAi1JREFUeNpiYKAa6J8y8T8Q30cXZ0LjK4AU4lMANw3GZkGXLMzJZ2QgpIskABBAVPI/Xr9DA6gBn7/rcUri9DNJACCAaO9lXICRkGZ8HmQkxWZ0g5iIdGEjNhew4NHwAKhBkWaBCxBAwwUBo+o9sWqxRZUAsamMiUDJtJ4szVAQgM8VTMRmFiAOIEszLsBCjCJcOYuQzRvwZUkWUm2jWiIZOAAQQKMIW8QV0MJcRmKyExI3EJjsNgyExchAEeiIBwNhMTIQBDriw0BYDAMfgA4QHAiLkcEBoCMcKSo1aeFjallMchxTYjFFqZpUi6mWjwes5Bp5ACCARtEoGJlNn/+0KESI7RD0U7vRTEpPRADqewN6WwwD54GWnx/Ixh5Z9TBVOn1A8B7osP6BsBgECshplzENVLZjona2JzbbUdtiogdDaGHxB2K69dS2uJDe7WqSBy+o4eMJ5IyYUOpjsksuci2+ALTQkBIXk2OxIdDSC5TGDwuJ2USQWomRidrZZBSMggEHAAHaNaMbAEEYiBLDgo7AJo7gaI7gCI5giMSAn0LLNb0XBuAlhF4LXIQQU3Q/vZfcnsPI2jNPtSZck+e66W/utCjcpPzw/DC4vAjXZPHNk/DbDxT53YvwVz6pvecACNec5aY/vAg3zb5UmUMVFitzFoSHlrklOCMa2OPQI40qLHZpIQmrlKXZwurBI06SnBYtNYUhmgdpYbj2UEIYegAwStjMiIcQQkxxA49895hLUEtfAAAAAElFTkSuQmCC')
				.on('click',(e) => {
					if (callback) callback(parseInt(offset)+parseInt(limit));
				})
			);
		}
	}
	else tis.alert('ページャーの指定に誤りがあります');
	return this;
}
HTMLElement.prototype.popup=function(maxwidth,maxheight,callback){
	return new tispopupwindow(this,maxwidth,maxheight,callback);
}
HTMLElement.prototype.removeclass=function(className){
	this.classList.remove(className);
	return this;
}
HTMLElement.prototype.show=function(){
	return this.css({display:'block'});
}
HTMLElement.prototype.spread=function(addcallback,delcallback,autoadd=true){
	/* setup properties */
	this.container=this.elm('tbody');
	this.tr=tis.children(this.container);
	this.template=this.tr.first().clone();
	this.addrow=(putcallback=true) => {
		var row=this.template.clone();
		this.container.append(row);
		/* setup properties */
		this.tr=tis.children(this.container);
		/* setup listener */
		var listener=(e) => {
			if (autoadd)
				if (e.currentTarget.value)
					if (!this.tr.last().isempty()) this.addrow();
		};
		row.elms('input,select,textarea').some((item,index) => {
			switch (item.initialize().tagName.toLowerCase())
			{
				case 'input':
					switch (item.type.toLowerCase())
					{
						case 'button':
						case 'image':
						case 'radio':
						case 'reset':
							break;
						case 'checkbox':
						case 'color':
						case 'date':
						case 'datetime-local':
						case 'file':
						case 'month':
						case 'range':
						case 'time':
						case 'week':
							item.on('change',listener);
							break;
						case 'number':
							item.on('mouseup,keyup',listener);
							break;
						default:
							item.on('keyup',listener);
							break;
					}
					break;
				case 'select':
					item.on('change',listener);
					break;
				case 'textarea':
					item.on('keyup',listener);
					break;
			}
		});
		if (putcallback)
			if (addcallback) addcallback(row,this.tr.length-1);
		return row;
	};
	this.delrow=(row) => {
		var index=this.tr.indexOf(row);
		this.container.removeChild(row);
		/* setup properties */
		this.tr=tis.children(this.container);
		if (autoadd)
		{
			if (this.tr.length==0) this.addrow();
			else
			{
				if (!this.tr.last().isempty()) this.addrow();
			}
		}
		if (delcallback) delcallback(this,index);
	};
	this.insertrow=(row) => {
		var add=this.addrow(false);
		this.container.insertBefore(add,row.nextSibling);
		/* setup properties */
		this.tr=tis.children(this.container);
		if (addcallback) addcallback(add,this.tr.indexOf(add)+1);
		return add;
	};
	this.clearrows=() => {
		this.tr.some((item,index) => {
			this.container.removeChild(item);
		});
		/* setup properties */
		this.tr=[];
	};
	/* setup rows */
	this.clearrows();
	if (autoadd) this.addrow();
	return this;
}
HTMLElement.prototype.text=function(value){
	if (typeof value!=='undefined')
	{
		this.textContent=value;
		return this;
	}
	else
	{
		var value=this.textContent;
		if (value)
			if (this.hasAttribute('data-type'))
				switch (this.attr('data-type'))
				{
					case 'date':
						if (value.length==8)
							if (tis.isnumeric(value))
								value=value.substr(0,4)+'-'+value.substr(4,2)+'-'+value.substr(6,2);
						break;
					case 'number':
						value=value.replace(/,/g,'');
						break;
				}
		return value;
	}
}
HTMLElement.prototype.val=function(value){
	if (typeof value!=='undefined')
	{
		this.value=value;
		return this;
	}
	else
	{
		var value=this.value;
		if (value)
			if (this.hasAttribute('data-type'))
				switch (this.attr('data-type'))
				{
					case 'date':
						if (value.length==8)
							if (tis.isnumeric(value))
								value=value.substr(0,4)+'-'+value.substr(4,2)+'-'+value.substr(6,2);
						break;
					case 'number':
						value=value.replace(/,/g,'');
						break;
				}
		return value;
	}
}
HTMLElement.prototype.visible=function(){
	return !(this.offsetWidth==0 && this.offsetHeight==0);
}
HTMLImageElement.prototype.assignfile=function(file){
	var reader=new FileReader();
	reader.onload=((readData) => {
		this.attr('src',readData.target.result);
	});
	reader.readAsDataURL(file);
	return this;
}
HTMLSelectElement.prototype.assignoption=function(records,display,value){
	for (var i=0;i<records.length;i++)
	{
		var record=records[i];
		this.append(
			tis.create('option')
			.attr('value',record[value])
			.html(record[display])
		);
	}
	return this;
}
HTMLSelectElement.prototype.selectedtext=function(){
	if (this.options.length!=0)	return this.options[this.selectedIndex].textContent;
	else return '';
}
Window.prototype.off=function(type,listener){
	var types=type.split(',');
	for (var i=0;i<types.length;i++)
	{
		if (listener) this.removeEventListener(types[i],listener);
		else
		{
			if (this in tis.eventlisteners)
				if (types[i] in tis.eventlisteners[this])
				{
					for (var i2=0;i2<tis.eventlisteners[this][types[i]].length;i2++)
						this.removeEventListener(types[i],tis.eventlisteners[this][types[i]][i2]);
				}
		}
	}
	return this;
}
Window.prototype.on=function(type,listener){
	var types=type.split(',');
	for (var i=0;i<types.length;i++)
	{
		if (!(this in tis.eventlisteners)) tis.eventlisteners[this]={};
		if (!(types[i] in tis.eventlisteners[this])) tis.eventlisteners[this][types[i]]=[];
		tis.eventlisteners[this][types[i]].push(listener);
		this.addEventListener(types[i],listener);
	}
	return this;
}
/*
Array extention
*/
Array.prototype.first=function(){
	return this[0];
}
Array.prototype.last=function(){
	return this[this.length-1];
}
/*
Date extention
*/
Date.prototype.calc=function(pattern){
	var year=this.getFullYear();
	var month=this.getMonth()+1;
	var day=this.getDate();
	var hour=this.getHours();
	var minute=this.getMinutes();
	var second=this.getSeconds();
	//first day of year
	if (pattern.match(/^first-of-year$/g)) {month=1;day=1};
	//first day of month
	if (pattern.match(/^first-of-month$/g)) day=1;
	//add years
	if (pattern.match(/^-?[0-9]+ year$/g)) year+=parseInt(pattern.match(/^-?[0-9]+/g));
	//add months
	if (pattern.match(/^-?[0-9]+ month$/g))
	{
		month+=parseInt(pattern.match(/^-?[0-9]+/g));
		//check of next year
		while (month<1) {year--;month+=12;}
		while (month>12) {year++;month-=12;}
		//check of next month
		var check=new Date(year,(month-1),day);
		if (check.getMonth()+1!=month)
		{
			check=new Date(year,month,1);
			check.setDate(0);
			day=check.getDate();
		}
	}
	//add day
	if (pattern.match(/^-?[0-9]+ day$/g)) day+=parseInt(pattern.match(/^-?[0-9]+/g));
	//add hour
	if (pattern.match(/^-?[0-9]+ hour/g)) hour+=parseInt(pattern.match(/^-?[0-9]+/g));
	//add minute
	if (pattern.match(/^-?[0-9]+ minute/g)) minute+=parseInt(pattern.match(/^-?[0-9]+/g));
	//add second
	if (pattern.match(/^-?[0-9]+ second/g)) second+=parseInt(pattern.match(/^-?[0-9]+/g));
	return new Date(year,(month-1),day,hour,minute,second);
}
Date.prototype.format=function(pattern){
	var year=this.getFullYear();
	var month=('0'+(this.getMonth()+1)).slice(-2);
	var day=('0'+this.getDate()).slice(-2);
	var hour=('0'+this.getHours()).slice(-2);
	var minute=('0'+this.getMinutes()).slice(-2);
	var second=('0'+this.getSeconds()).slice(-2);
	var symbol=pattern.match(/(-|\/)/g);
	//year
	if (pattern.match(/^Y$/g)) return year;
	//month
	if (pattern.match(/^m$/g)) return month;
	//day
	if (pattern.match(/^d$/g)) return day;
	//hour
	if (pattern.match(/^H$/g)) return hour;
	//minute
	if (pattern.match(/^i$/g)) return minute;
	//second
	if (pattern.match(/^s$/g)) return second;
	//year-month
	if (pattern.match(/^Y(-|\/){1}m$/g)) return year+symbol[0]+month;
	//year-month-day
	if (pattern.match(/^Y(-|\/){1}m(-|\/){1}d$/g)) return year+symbol[0]+month+symbol[0]+day;
	//year-month-day hour
	if (pattern.match(/^Y(-|\/){1}m(-|\/){1}d H$/g)) return year+symbol[0]+month+symbol[0]+day+' '+hour;
	//year-month-day hour:minute
	if (pattern.match(/^Y(-|\/){1}m(-|\/){1}d H:i$/g)) return year+symbol[0]+month+symbol[0]+day+' '+hour+':'+minute;
	//year-month-day hour:minute:second
	if (pattern.match(/^Y(-|\/){1}m(-|\/){1}d H:i:s$/g)) return year+symbol[0]+month+symbol[0]+day+' '+hour+':'+minute+':'+second;
	//month-day
	if (pattern.match(/^m(-|\/){1}d$/g)) return month+symbol[0]+day;
	//month-day hour
	if (pattern.match(/^m(-|\/){1}d H$/g)) return month+symbol[0]+day+' '+hour;
	//month-day hour:minute
	if (pattern.match(/^m(-|\/){1}d H:i$/g)) return month+symbol[0]+day+' '+hour+':'+minute;
	//month-day hour:minute:second
	if (pattern.match(/^m(-|\/){1}d H:i:s$/g)) return month+symbol[0]+day+' '+hour+':'+minute+':'+second;
	//day hour
	if (pattern.match(/^d H$/g)) return day+' '+hour;
	//day hour:minute
	if (pattern.match(/^d H:i$/g)) return day+' '+hour+':'+minute;
	//day hour:minute:second
	if (pattern.match(/^d H:i:s$/g)) return day+' '+hour+':'+minute+':'+second;
	//hour:minute
	if (pattern.match(/^H:i$/g)) return hour+':'+minute;
	//hour:minute:second
	if (pattern.match(/^H:i:s$/g)) return hour+':'+minute+':'+second;
	//minute:second
	if (pattern.match(/^i:s$/g)) return minute+':'+second;
	return '';
}
/*
Number extention
*/
Number.prototype.comma=function(digit){
	var res=String(this);
	if (digit)
	{
		res=this.toFixed(parseInt(digit)).split('.');
		res[0]=res[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1,');
		res=res.join('.');
	}
	else res=res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1,');
	return res;
}
/*
String extention
*/
String.prototype.bytelength=function(){
	var res=0;
	for (var i=0;i<this.length;i++)
	{
		var char=this.charCodeAt(i);
		if ((char>=0x0 && char<0x81) || (char===0xf8f0) || (char>=0xff61 && char<0xffa0) || (char>=0xf8f1 && char<0xf8f4)) res+=1;
		else res+=2;
	}
	return res;
}
String.prototype.lpad=function(pattern,length){
	var padding='';
	for (var i=0;i<length;i++) padding+=pattern;
	return (padding+this).slice(length*-1);
}
String.prototype.rpad=function(pattern,length){
	var padding='';
	for (var i=0;i<length;i++) padding+=pattern;
	return (this+padding).slice(0,length);
}
String.prototype.parseDateTime=function(){
	var format=this;
	if (isNaN(Date.parse(format))) format=format.replace(/-/g,'\/').replace(/T/g,' ').replace(/Z/g,'');
	return new Date(format);
}
