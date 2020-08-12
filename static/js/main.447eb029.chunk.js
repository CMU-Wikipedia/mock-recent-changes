(this["webpackJsonpmock-recent-changes"]=this["webpackJsonpmock-recent-changes"]||[]).push([[0],{106:function(e,t,a){e.exports=a(136)},111:function(e,t,a){},136:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),r=a(8),l=a.n(r),o=(a(111),a(32)),c=a(33),s=a(50),f=a(36),d=a(35),m=a(90),h=a(84),u=a.n(h),g=(a(80),a(81),a(85)),p=a.n(g),v=a(164),b=function(e){Object(f.a)(a,e);var t=Object(d.a)(a);function a(e){return Object(o.a)(this,a),t.call(this,e)}return Object(c.a)(a,[{key:"ValidateIPaddress",value:function(e){return/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(e)}},{key:"render",value:function(){var e=this.props.revision;return void 0===e?i.a.createElement(v.a,null):i.a.createElement("div",{class:"diff"},i.a.createElement("strong",null,"Revision ID: "),i.a.createElement("a",{href:"https://en.wikipedia.org/w/index.php?title=&diff=prev&oldid="+e.rev_id,target:"_blank"},e.rev_id),i.a.createElement("div",{class:"row"},i.a.createElement("div",null,i.a.createElement("strong",null,"Article Title: "),e.title)),i.a.createElement("h5",null,"Edited by"," ",this.ValidateIPaddress(e.username)?"Anonymous":e.username," at"," ",e.timestamp.toLocaleTimeString()," on"," ",e.timestamp.toLocaleDateString(void 0,{weekday:"long",year:"numeric",month:"long",day:"numeric"})),""!==e.comment&&i.a.createElement("div",null,i.a.createElement("strong",null,"Comment from Editor:"),i.a.createElement("p",{dangerouslySetInnerHTML:{__html:e.comment}})),i.a.createElement("table",{dangerouslySetInnerHTML:{__html:"<tr class='header'><td class='before' colspan='2'>Before</td><td class='after' colspan='2'>After</td></tr>"+e.diff}}))}}]),a}(n.Component),y=a(46),k=a(89),E=a.n(k),x=function(e){Object(f.a)(a,e);var t=Object(d.a)(a);function a(e){return Object(o.a)(this,a),t.call(this,e)}return Object(c.a)(a,[{key:"renderItem",value:function(e){if(this.props.filters){for(var t=!1,a=0,n=[],r="#ffffff",l=Object.keys(this.props.filters),o=0;o<l.length;o++)for(var c=Object.keys(this.props.filters[l[o]]),s=0;s<c.length;s++){var f="damaging"===l[o]?e.confidence_damage:e.confidence_faith,d=this.props.filters[l[o]][c[s]].thresholds.min,m=this.props.filters[l[o]][c[s]].thresholds.max,h=this.props.filters[l[o]][c[s]].highlight;this.props.filters[l[o]][c[s]].checked&&(a++,t=t||!(f<d||f>m)),f<d||f>m||"#ffffff"===h||(r=h,n.push(h))}return 0===a&&(t=!0),t?i.a.createElement("div",{className:"editLine"},i.a.createElement("div",{className:"dots"},n.map((function(e){return i.a.createElement(E.a,{fontSize:"small",style:{fill:e,height:10,width:10}})}))),i.a.createElement("li",{style:{backgroundColor:r+"44"}},i.a.createElement("strong",null,e.confidence_damage.toFixed(3)," / ",e.confidence_faith.toFixed(3))," ",i.a.createElement(y.b,{to:"/d/"+e.rev_id},"Diff")," - ",i.a.createElement("strong",null,e.title)," ",e.timestamp.toLocaleTimeString()," (",e.size,") . . ",e.username," . ."," ",i.a.createElement("em",{dangerouslySetInnerHTML:{__html:e.comment}}))):i.a.createElement("li",{style:{display:"none"}})}}},{key:"render",value:function(){var e=this;return i.a.createElement("ul",{style:{paddingInlineStart:0}},this.props.data?this.props.data.map((function(t){return e.renderItem(t)})):i.a.createElement(v.a,null))}}]),a}(n.Component),w=a(169),_=a(91),S=a(177),j=a(168),O=a(137),T=a(170),z=a(171),C=a(172),F=a(173),I=a(175),A=a(174),B=a(178),D=a(10),L=Object(_.a)({typography:{root:{component:"div"},fontFamily:"Noto Sans KR",subtitle1:{fontFamily:"Noto Serif",fontSize:"24px"},subtitle2:{fontSize:"12px",marginTop:"10px",color:"#B0B0B0",fontWeight:"bold",textTransform:"uppercase",textAlign:"left"},h6:{fontWeight:"bold",fontSize:"16px",textAlign:"left"},body1:{fontSize:"14px"},body2:{textAlign:"left",fontSize:"14px"},button:{fontStyle:"italic"},h5:{fontSize:"15px",color:"#3777a5",fontWeight:"bold",textTransform:"none",textAlign:"left"}}});L=Object(S.a)(L);Object(j.a)((function(e){return{root:{display:"flex"},appBar:{width:"calc(100% - ".concat(270,"px)"),marginLeft:270},drawer:{width:270,flexShrink:0,textAlign:"center",position:"relative"},drawerPaper:{width:270,paddingTop:"35px",paddingBottom:"35px"},paper:{textAlign:"left",padding:"20px 20px"},list:{fontSize:"16px",textDecoration:"none"},toolbar:{padding:e.spacing(2)},content:{width:"calc(100% - ".concat(270,"px)"),flexGrow:1,backgroundColor:e.palette.background.default,padding:"1.5vh",height:"100vh"}}}));var R=function(e){Object(f.a)(a,e);var t=Object(d.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).toggle=n.toggle.bind(Object(s.a)(n)),n.state={data:null,thresholdsFound:!1,filters:{damaging:{likelygood:{thresholds:{min:0,max:"maximum recall @ precision >= 0.995"},checked:!1,highlight:"#ffffff"},maybebad:{thresholds:{min:"maximum filter_rate @ recall >= 0.9",max:1},checked:!1,highlight:"#ffffff"},likelybad:{thresholds:{min:"maximum recall @ precision >= 0.6",max:1},checked:!1,highlight:"#ffffff"},verylikelybad:{thresholds:{min:"maximum recall @ precision >= 0.9",max:1},checked:!1,highlight:"#ffffff"}},goodfaith:{likelygood:{thresholds:{min:"maximum recall @ precision >= 0.995",max:1},checked:!1,highlight:"#ffffff"},maybebad:{thresholds:{min:0,max:"maximum filter_rate @ recall >= 0.9"},checked:!1,highlight:"#ffffff"},likelybad:{thresholds:{min:0,max:"maximum recall @ precision >= 0.6"},checked:!1,highlight:"#ffffff"},verylikelybad:{thresholds:{min:0,max:0},checked:!1,highlight:"#ffffff"}}}},n}return Object(c.a)(a,[{key:"getFilterThresholds",value:function(){var e=this.state.filters,t=function(t){var a=function(a){var n=function(n){"string"===typeof e[t][a].thresholds[n]&&u.a.get("https://ores.wikimedia.org/v3/scores/enwiki/?models="+t+'&model_info=statistics.thresholds.true."'+e[t][a].thresholds[n]+'"').then((function(i){e[t][a].thresholds[n]=parseFloat(i.data.enwiki.models[t].statistics.thresholds.true[0].threshold.toFixed(3))}))};for(var i in e[t][a].thresholds)n(i)};for(var n in e[t])a(n)};for(var a in e)t(a);this.setState({filters:e,thresholdsFound:!0})}},{key:"componentDidMount",value:function(){var e=this;this.getFilterThresholds(),m.a(p.a,(function(e){return{confidence_faith:+e.confidence_faith,faith_label:"TRUE"===e.goodfaith,confidence_damage:+e.confidence_damage,damaging_label:"TRUE"===e.damaging,rev_id:+e.rev_id,anonymous:"TRUE"===e.anonymous,newcomer:e.edit_years<=8,username:e.username,title:e.title,timestamp:new Date(e.timestamp),size:+e.size,comment:e.parsed_comment,diff:e.diff}})).then((function(t){e.setState({data:t,checked:{damaging:{likelygood:!1,maybebad:!1,likelybad:!1,verylikelybad:!1},goodfaith:{likelygood:!1,maybebad:!1,likelybad:!1}}})}))}},{key:"toggle",value:function(e,t){var a=this.state.filters;a[e][t].checked=!a[e][t].checked,this.setState({filters:a})}},{key:"changeColor",value:function(e,t,a){var n=this.state.filters;n[e][t].highlight=a.target.value,this.setState({filters:n})}},{key:"render",value:function(){var e=this,t=this.state.data||[],a=this.state.filters||{};return i.a.createElement(y.a,{basename:"/mock-recent-changes/"},i.a.createElement(w.a,{theme:L},i.a.createElement("div",{className:"App"},i.a.createElement(y.b,{to:"/"},i.a.createElement(O.a,{variant:"subtitle1"},"Recent Changes")),i.a.createElement(D.c,null,t&&void 0!==t&&i.a.createElement(D.a,{path:"/d/:id",render:function(e){var a=e.match;return i.a.createElement(b,{revision:t.find((function(e){return e.rev_id===parseInt(a.params.id)}))})}}),i.a.createElement(D.a,{path:"/"},this.state.thresholdsFound?i.a.createElement(T.a,{style:{flexDirection:"row"}},Object.keys(a).map((function(t){return i.a.createElement("div",{style:{display:"flex",flexDirection:"column",width:"25vw"}},i.a.createElement(z.a,null,t),i.a.createElement(C.a,null,Object.keys(a[t]).map((function(n){return i.a.createElement("div",null,i.a.createElement(F.a,{control:i.a.createElement(I.a,{onClick:function(){return e.toggle(t,n)}}),label:n}),i.a.createElement(T.a,null,i.a.createElement(A.a,{value:a[t][n].highlight,onChange:function(a){return e.changeColor(t,n,a)}},["#ffffff","#495cd0","#43b286","#f6d00e","#f06d1f","#ce2d37"].map((function(e){return i.a.createElement(B.a,{value:e},e)})))))}))))}))):i.a.createElement(v.a,null),i.a.createElement(x,{data:t,filters:a}))))))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(R,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},80:function(e,t,a){},81:function(e,t,a){},85:function(e,t,a){e.exports=a.p+"static/media/data-moreinfo.76afb407.csv"}},[[106,1,2]]]);
//# sourceMappingURL=main.447eb029.chunk.js.map