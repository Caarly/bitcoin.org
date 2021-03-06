function addEvent(a,b,c){
//Attach event to a DOM node.
//Ex. addEvent(node,'click',function);
return (a.addEventListener)?a.addEventListener(b,c,false):(a.attachEvent)?a.attachEvent('on'+b,c):false;
}

function removeEvent(a,b,c){
//Detach event from a DOM node.
//Ex. removeEvent(node,'click',function);
return (a.removeEventListener)?a.removeEventListener(b,c,false):(a.detachEvent)?a.detachEvent('on'+b,c):false;
}

function cancelEvent(e){
//Cancel current event.
//Ex. cancelEvent(event);
if(!e)var e=window.event;(e.preventDefault)?e.preventDefault():e.returnValue=false;
}

function getEventTarget(e){
//Return target DOM node on which the event is triggered.
//Ex. getEventTarget(event);
if(!e)var e=window.event;return (e.target&&e.target.nodeType==3)?e.target.parentNode:(e.target)?e.target:e.srcElement;
}

function getStyle(a,b){
//Return the value of the computed style on a DOM node.
//Ex. getStyle(node,'padding-bottom');
if(window.getComputedStyle)return document.defaultView.getComputedStyle(a,null).getPropertyValue(b);
var n=b.indexOf('-');
if(n!==-1)b=b.substr(0,n)+b.substr(n+1,1).toUpperCase()+b.substr(n+2);
return a.currentStyle[b];
}

function getWidth(a){
//Return the integer value of the computed width of a DOM node.
//Ex. getWidth(node);
var w=getStyle(a,'width');
if(w.indexOf('px')!==-1)return parseInt(w.replace('px',''));
var p=[getStyle(a,'padding-top'),getStyle(a,'padding-right'),getStyle(a,'padding-bottom'),getStyle(a,'padding-left')];
for(var i=0;i<4;i++){
	if(p[i].indexOf('px')!==-1)p[i]=parseInt(p[i]);
	else p[i]=0;
}
return Math.max(0,a.offsetWidth-p[1]-p[3]);
}

function getHeight(a){
//Return the integer value of the computed height of a DOM node.
//Ex. getHeight(node);
var h=getStyle(a,'height');
if(h.indexOf('px')!==-1)return parseInt(h.replace('px',''));
var p=[getStyle(a,'padding-top'),getStyle(a,'padding-right'),getStyle(a,'padding-bottom'),getStyle(a,'padding-left')];
for(var i=0;i<4;i++){
	if(p[i].indexOf('px')!==-1)p[i]=parseInt(p[i]);
	else p[i]=0;
}
return Math.max(0,a.offsetHeight-p[0]-p[2]);
}

function getLeft(a){
//Return the integer value of the computed distance between given node and the browser window.
//Ex. getLeft(node);
var b=a.offsetLeft;
while(a.offsetParent){a=a.offsetParent;b+=a.offsetLeft;}
return b;
}

function getTop(a){
//Return the integer value of the computed distance between given node and the browser window.
//Ex. getTop(node);
var b=a.offsetTop;
while(a.offsetParent){a=a.offsetParent;b+=a.offsetTop;}
return b;
}

function getPageYOffset(){
//Return the integer value for the vertical position of the scroll bar.
return (window.pageYOffset)?window.pageYOffset:document.documentElement.scrollTop;
}

function getPageXOffset(){
//Return the integer value for the horizontal position of the scroll bar.
return (window.pageXOffset)?window.pageXOffset:document.documentElement.scrollLeft;
}

function getWindowY(){
//Return the integer value for the browser window height.
return (window.innerHeight)?window.innerHeight:document.documentElement.clientHeight;
}

function getWindowX(){
//Return the integer value for the browser window width.
return (window.innerWidth)?window.innerWidth:document.documentElement.clientWidth;
}

function isMobile(){
//Return true if the mobile CSS stylesheet is used.
if(getStyle(document.getElementById('detectmobile'),'display')!='none')return true;
return false;
}

function addClass(node,data){
//Add class to node.
var cl=node.className.split(' ');
for(var i=0,n=cl.length;i<n;i++){if(cl[i]==data)return;}
cl.push(data);
node.className=cl.join(' ');
}

function removeClass(node,data){
//Remove class from node.
var ocl=node.className.split(' ');
var ncl=[];
for(var i=0,n=ocl.length;i<n;i++){if(ocl[i]!=data)ncl.push(ocl[i]);}
node.className=ncl.join(' ');
}

function scrollToNode(t){
//Scroll to any node on the page.
if(document.body.getAttribute('data-scrollstatus')!=null){clearInterval(document.body.getAttribute('data-scrollstatus'));document.body.removeAttribute('data-scrollstatus');}
var delay=800;
var py=getPageYOffset();
var fy=getTop(t)
var dy=fy-py;
var x=getPageXOffset();
var oti=new Date().getTime();
document.body.setAttribute('data-scrollstatus',setInterval(function(){
	var nti=new Date().getTime()-oti;
	if(nti>=delay){
		window.scrollTo(x,fy);
		clearInterval(document.body.getAttribute('data-scrollstatus'));
		document.body.removeAttribute('data-scrollstatus');
		return;
	}
	var p=nti/delay;
	p=p*(1+(0.5*(1-p)));
	window.scrollTo(x,(py+(dy*p)).toFixed(0));
},10));
}

function supportsSVG(){
//Return true if the browser supports SVG.
//Ex. if(!supportsSVG()){..apply png fallback..}
//Old FF 3.5 and Safari 3 versions have svg support, but a very poor one
//http://www.w3.org/TR/SVG11/feature#Image Defeat FF 3.5 only
//http://www.w3.org/TR/SVG11/feature#Animation Defeat Saf 3 but also returns false in IE9
//http://www.w3.org/TR/SVG11/feature#BasicGraphicsAttribute Defeat Saf 3 but also returns false in Chrome and safari4
//http://www.w3.org/TR/SVG11/feature#Text Defeat Saf 3 but also returns false in FF and safari4
if(!document.createElementNS||!document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect)return false;
if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1"))return false;
if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicGraphicsAttribute","1.1")&&!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Animation","1.1")&&!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Text","1.1"))return false;
return true;
}

function fallbackSVG(){
//Replace all images extensions from .svg to .png if browser doesn't support SVG files.
if(supportsSVG())return;  
for(var i=0,nd=document.getElementsByTagName('*'),n=nd.length;i<n;i++){
	if(nd[i].nodeName=='IMG'&&/.*\.svg$/.test(nd[i].src))nd[i].src=nd[i].src.slice(0,-3)+'png';
	if(/\.svg/.test(getStyle(nd[i],'background-image')))nd[i].style.backgroundImage=getStyle(nd[i],'background-image').replace('.svg','.png');
	if(/\.svg/.test(getStyle(nd[i],'background')))nd[i].style.background=getStyle(nd[i],'background').replace('.svg','.png');
}
}

function mobileMenuShow(e){
//Show the mobile menu when the visitors touch the menu icon.
var mm=document.getElementById('menusimple');
var ml=document.getElementById('langselect');
var t=document.getElementById('menumobile');
if(mm.style.display=='block'){mm.style.display='';ml.style.display='';}
else{mm.style.display='block';ml.style.display='block';}
t.parentNode.removeChild(t);
cancelEvent(e);
}

function mobileMenuHover(e){
//Add a delay before hiding menu for mobiles to prevent accidental clicks
var p=t=getEventTarget(e);
if(t.nodeName!='A')return;
while(p.parentNode.nodeName!='DIV')p=p.parentNode;
while(t.nodeName!='LI'||t.parentNode!=p)t=t.parentNode;
var ul=null;
if(t.getElementsByTagName('UL').length>0){
	var ul=t.getElementsByTagName('UL')[0];
	addClass(ul,'hover');
}
setTimeout(function(){
for(var i=0,nd=p.getElementsByTagName('UL'),n=nd.length;i<n;i++){
	if(nd[i]==ul)continue;
	removeClass(nd[i],'hover');
}
},1);
}

function boxShow(e){
//Display the box content when the user click a box on the "Secure your wallet" page.
var p=t=getEventTarget(e);
while(p.nodeName!='DIV')p=p.parentNode;
var sh=getHeight(p);
for(var i=0,nds=p.childNodes,n=nds.length;i<n;i++)if(nds[i].nodeType==1)nds[i].style.display='block';
t.removeAttribute('href');
t.onclick='';
var dh=getHeight(p);
p.style.height=sh+'px';
setTimeout(function(){
	p.style.transition='height 400ms ease-out';
	p.style.MozTransition='height 400ms ease-out';
	p.style.WebkitTransition='height 400ms ease-out';
	setTimeout(function(){p.style.height=dh+'px';},20);
},20);
cancelEvent(e);
}

function faqShow(e){
//Display the content of a question in the FAQ at user request.
var p=t=getEventTarget(e);
while(p.nodeType!=1||p.nodeName!='DIV')p=p.nextSibling;
var pp=p.cloneNode(true);
pp.style.visibility='hidden';
pp.style.height='auto';
p.parentNode.appendChild(pp);
var nhe=getHeight(pp);
pp.parentNode.removeChild(pp);
if(p.style.height!='0px'&&p.style.height!='')p.style.height='0px';
else p.style.height=nhe+'px';
cancelEvent(e);
}

function materialShow(e){
//Display more materials on the "Press center" page at user request.
var p=t=getEventTarget(e);
while(p.nodeType!=1||p.nodeName!='DIV')p=p.previousSibling;
var pp=p.cloneNode(true);
pp.style.visibility='hidden';
pp.style.height='auto';
p.parentNode.appendChild(pp);
var nhe=getHeight(pp);
pp.parentNode.removeChild(pp);
if(p.style.height!='0px'&&p.style.height!='')p.style.height='0px';
else p.style.height=nhe+'px';
t.style.display='none';
cancelEvent(e);
}

function librariesShow(e){
//Display more open source projects on the "Development" page at user request.
var p=t=getEventTarget(e);
while(p.nodeType!=1||p.nodeName!='UL')p=p.parentNode;
var sh=getHeight(p);
for(var i=0,nds=p.getElementsByTagName('LI'),n=nds.length;i<n;i++)nds[i].style.display='list-item';
t.parentNode.parentNode.removeChild(t.parentNode);
var dh=getHeight(p);
p.style.height=sh+'px';
setTimeout(function(){
	p.style.transition='height 400ms ease-out';
	p.style.MozTransition='height 400ms ease-out';
	p.style.WebkitTransition='height 400ms ease-out';
	setTimeout(function(){p.style.height=dh+'px';},20);
},20);
cancelEvent(e);
}

function freenodeShow(e){
//Display freenode chat window on the "Development" page at user request.
document.getElementById('chatbox').innerHTML='<iframe style=width:98%;min-width:400px;height:600px src="http://webchat.freenode.net/?channels=bitcoin-dev" />';
cancelEvent(e);
}

function updateToc(){
//Update table of content active entry and browser url on scroll
var pageoffset;
var windowy;
var toc;
var first;
var last;
var closer;
var init=function(){
	setenv();
	updatehistory();
	updatetoc();
}
//Set variables
var setenv=function(){
	pageoffset=getPageYOffset();
	windowy=getWindowY();
	toc=document.getElementById('toc');
	fallback=document.getElementsByTagName('H2')[0];
	first=[fallback,getTop(fallback)];
	last=[fallback,getTop(fallback)];
	closer=[fallback,getTop(fallback)];
	//Find all titles
	var nodes=[];
	var tags=['H2','H3','H4','H5','H6'];
	for(var i=0,n=tags.length;i<n;i++){
		for(var ii=0,t=document.getElementsByTagName(tags[i]),nn=t.length;ii<nn;ii++)nodes.push(t[ii]);
	}
	//Find first title, last title and closer title
	for(var i=0,n=nodes.length;i<n;i++){
		if(!nodes[i].id)continue;
		var top=getTop(nodes[i]);
		if(top<first[1])first=[nodes[i],top];
		if(top>last[1])last=[nodes[i],top];
		if(top<pageoffset+10&&top>closer[1])closer=[nodes[i],top];
	}
	//Set closer title to first or last title if at the top or bottom of the page
	if(pageoffset<first[1])closer=[first[0],first[1]];
	if(windowy+pageoffset>=getHeight(document.body))closer=[last[0],last[1]];
}
//Update toc position and set active toc entry
var updatetoc=function(){
	//Set bottom and top to fit within window and not overflow its parent node
	var div=toc.getElementsByTagName('DIV')[0];
	if(pageoffset>getTop(toc)){
		addClass(div,'scroll');
		div.style.top='20px';
		div.style.bottom=Math.max((pageoffset+windowy)-(getHeight(toc.parentNode)+getTop(toc.parentNode)),20)+'px';
	}
	else removeClass(div,'scroll');
	//Remove .active class from toc and find new active toc entry
	var a=false;
	for(var i=0,t=toc.getElementsByTagName('*'),n=t.length;i<n;i++){
		removeClass(t[i],'active');
		if(t[i].nodeName=='A'&&t[i].getAttribute('href')=='#'+closer[0].id)a=t[i];
	}
	if(a===false)return;
	//Set .active class on new active toc entry
	while(a.parentNode.nodeName=='LI'||a.parentNode.nodeName=='UL'){
		addClass(a,'active');
		a=a.parentNode;
	}
}
//Update browser url
var updatehistory=function(){
	//Don't call window.history if not supported
	if(!window.history||!window.history.replaceState)return;
	//Don't update window url when it doesn't need to be updated
	if(new RegExp('#'+closer[0].id+'$').test(window.location.href.toString()))return;
	//Don't update window url when the window is over the first title in the page
	if(pageoffset<first[1])return;
	//Don't update window url when page is not loaded, or user just clicked a url
	if(!toc.hasAttribute('data-timestamp')||toc.getAttribute('data-timestamp')>new Date().getTime()-1000)return;
	window.history.replaceState(null,null,'#'+closer[0].id);
}
//Update the toc when the page stops scrolling
var evtimeout=function(){
	toc=document.getElementById('toc');
	clearTimeout(toc.getAttribute('data-timeout'));
	toc.setAttribute('data-timeout',setTimeout(init,1));
}
//Reset timestamp on page load and each time the user clicks a url
var evtimestamp=function(){
	toc=document.getElementById('toc');
	document.getElementById('toc').setAttribute('data-timestamp',new Date().getTime());
}
addEvent(window,'scroll',evtimeout);
addEvent(window,'popstate',evtimestamp);
addEvent(window,'load',evtimestamp);
init();
}

function addAnchorLinks(){
//Apply anchor links icon on each title displayed on CSS hover
var nodes=[];
var tags=['H2','H3','H4','H5','H6'];
for(var i=0,n=tags.length;i<n;i++){
	for(var ii=0,t=document.getElementsByTagName(tags[i]),nn=t.length;ii<nn;ii++)nodes.push(t[ii]);
}
for(var i=0,n=nodes.length;i<n;i++){
	if(!nodes[i].id)continue;
	if(nodes[i].getElementsByTagName('A').length>0)return;
	addClass(nodes[i],'anchorAf');
	var anc=document.createElement('A');
	anc.href='#'+nodes[i].id;
	nodes[i].insertBefore(anc,nodes[i].firstChild);
}
}

function updateIssue(e){
//Update GitHub issue link with pre-filled with current page location
var t=getEventTarget(e);
t.href='https://github.com/bitcoin/bitcoin.org/issues/new?body='+encodeURIComponent('Location: '+window.location.href.toString()+"\n\n");
}

function disclaimerClose(e){
//Auto close temporary disclaimer in devel-docs
if(e)cancelEvent(e);
var t=document.getElementById('develdocdisclaimer')
t.parentNode.removeChild(t);
if(typeof(Storage)==='undefined')return;
sessionStorage.setItem('develdocdisclaimerclose','1');
}

function disclaimerAutoClose(){
//Auto close temporary disclaimer in devel-docs if session says so
if(typeof(Storage)==='undefined')return;
if(sessionStorage.getItem('develdocdisclaimerclose')==='1')disclaimerClose();
}

function walletListener(e){
//Listen events on the wallets categories menu and hide / show / select wallets accordingly.
var t=getEventTarget(e);
switch(e.type){
case 'click':
	if(t.nodeName=='A')walletSelectPlatform(t);
break;
case 'mouseover':
	if(t.nodeName=='A')walletShowPlatform(t.getAttribute('data-walletcompat'));
	if(t.nodeName=='A')clearTimeout(document.getElementById('walletmenu').getAttribute('data-wallettimeout'));
break;
case 'mouseout':
	clearTimeout(document.getElementById('walletmenu').getAttribute('data-wallettimeout'));
	document.getElementById('walletmenu').setAttribute('data-wallettimeout',setTimeout(walletFallbackPlatform,100));
break;
}
}

function walletSelectPlatform(t){
//Select wallets platform when the mouse clicks on the menu.
var p=t;
while(p.nodeName!='DIV')p=p.parentNode;
for(var i=0,nds=p.getElementsByTagName('A'),n=nds.length;i<n;i++){
	nds[i].removeAttribute('data-select');
	removeClass(nds[i].parentNode,'select');
}
t.setAttribute('data-select','1');
addClass(t.parentNode,'select');
if(isMobile()&&t.parentNode.getElementsByTagName('UL').length==0){
	setTimeout(function(){scrollToNode(document.getElementById('wallets'));},10);
}
}

function walletFallbackPlatform(){
//Show back wallets for selected platform when the mouse leaves the menu without selecting another platform.
var select=null;
var active=null;
for(var i=0,nds=document.getElementById('walletmenu').getElementsByTagName('A'),n=nds.length;i<n;i++){
	if(nds[i].getAttribute('data-select')=='1')select=nds[i];
	if(nds[i].getAttribute('data-active')=='1')active=nds[i];
}
if(select===null||active===null)return;
walletShowPlatform(select.getAttribute('data-walletcompat'));
}

function walletShowPlatform(platform){
//Show wallets for given platform in the menu.
for(var i=0,nds=document.getElementById('walletmenu').getElementsByTagName('A'),n=nds.length;i<n;i++){
	nds[i].removeAttribute('data-active');
	removeClass(nds[i].parentNode,'active');
	if(nds[i].getAttribute('data-walletcompat')!=platform)continue;
	var t=nds[i];
}
t.setAttribute('data-active','1');
addClass(t.parentNode,'active');
if(t.parentNode.parentNode.parentNode.nodeName=='LI')addClass(t.parentNode.parentNode.parentNode,'active');
for(var i=0,nds=document.getElementById('wallets').childNodes,n=nds.length;i<n;i++){
	if(nds[i].nodeType!=1)continue;
	if(nds[i].getAttribute('data-walletcompat').indexOf(platform)!==-1)removeClass(nds[i],'disabled');
	else addClass(nds[i],'disabled');
	addClass(nds[i],'nohover');
	var id=nds[i].id.replace('wallet-','');
	if(!document.getElementById('wallet-'+id+'-'+platform))continue;
	nds[i].replaceChild(document.getElementById('wallet-'+id+'-'+platform).getElementsByTagName('DIV')[0].cloneNode(true),nds[i].getElementsByTagName('DIV')[0]);
}
}

function walletRotate(){
//Rotate wallets once a day.
var ar={1:[],2:[],3:[],4:[]}
for(var i=0,nds=document.getElementById('wallets').childNodes,n=nds.length;i<n;i++){
	if(nds[i].nodeType!=1)continue;
	ar[parseInt(nds[i].getAttribute('data-walletlevel'))].push(nds[i]);
}
var sum=Math.floor(new Date()/86400000);
for(var k in ar){
	var pre=ar[k][ar[k].length-1].nextSibling;
	for(i=0,n=sum%ar[k].length;i<n;i++)ar[k][i].parentNode.insertBefore(ar[k][i],pre);
}
}

function walletMobileShow(e){
//Show selected wallet on mobiles and scroll to it.
var t=getEventTarget(e);
if(t.id=='wallets')return;
while(t.parentNode.id!='wallets')t=t.parentNode;
t=t.cloneNode(true);
var p=document.getElementById('walletsmobile');
if(getStyle(p,'display')=='none')return;
p.innerHTML='';
p.appendChild(t);
scrollToNode(p);
}

function walletDisabledShow(e){
//Show disabled wallet on click and disable wallet when mouse leaves the wallet.
var t=getEventTarget(e);
while(t.nodeName!='DIV'&&t.parentNode.id!='wallets'){
	if(t.id=='wallets')return;
	t=t.parentNode;
}
t.setAttribute('data-previousclass',t.className);
removeClass(t,'nohover');
removeClass(t,'disabled');
addEvent(t,'mouseover',walletDisabledHide);
addEvent(t,'mouseout',walletDisabledHide);
}

function walletDisabledHide(e){
//Disable wallet when the mouse leaves the wallet bubble.
var t=getEventTarget(e);
while(t.nodeName!='DIV'||t.parentNode.id!='wallets'){
	if(t.id=='wallets')return;
	t=t.parentNode;
}
clearTimeout(t.getAttribute('data-disabletimeout'));
if(e.type=='mouseover')return;
t.setAttribute('data-disabletimeout',setTimeout(function(){
	for(var i=0,nds=t.getAttribute('data-previousclass').split(' '),n=nds.length;i<n;i++)addClass(t,nds[i]);
	t.removeAttribute('data-disabletimeout');
	removeEvent(t,'mouseout',walletDisabledHide);
	removeEvent(t,'mouseover',walletDisabledHide);
},1));
}

function makeEditable(e){
//An easter egg that makes the page editable when user click on the page and hold their mouse button for one second.
//This trick allows translators and writers to preview their work.
if(!e)var e=window.event;
switch(e.type){
case 'mousedown':
if((e.which&&e.which==3)||(e.button&&e.button==2))return;
var t=getEventTarget(e);
while(t.parentNode){
	if(getStyle(t,'overflow')=='auto'||getStyle(t,'overflow-y')=='auto'||getStyle(t,'overflow-x')=='auto')return;
	t=t.parentNode;
}
addEvent(document.body,'mouseup',makeEditable);
addEvent(document.body,'mousemove',makeEditable);
document.body.setAttribute('timeoutEdit',setTimeout(function(){
	removeEvent(document.body,'mouseup',makeEditable);
	removeEvent(document.body,'mousemove',makeEditable);
	var c=document.getElementById('content');
	c.contentEditable=true;
	c.style.borderColor='#bfbfbf';
	setTimeout(function(){c.style.borderColor='';},200);
},1000));
break;
case 'mouseup':
case 'mousemove':
removeEvent(document.body,'mouseup',makeEditable);
removeEvent(document.body,'mousemove',makeEditable);
clearTimeout(document.body.getAttribute('timeoutEdit'));
break;
}
}

//Add makeEditable event listener
var xint=setInterval(function(){
if(!document.body)return;
addEvent(document.body,'mousedown',makeEditable);
clearInterval(xint);
},200);
