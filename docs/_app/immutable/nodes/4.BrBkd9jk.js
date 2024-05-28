import{s as ee,e as C,j as S,t as H,Z as ye,c as x,d as k,l as M,a as L,b as O,k as W,m as E,u as Y,f as p,i as R,_ as _e,$ as Q,g as K,B as ve,n as $,y as ae,r as ge,o as Z,U as fe,a0 as Ee}from"../chunks/scheduler.CnY5WKvn.js";import{S as te,i as ne,t as U,g as ce,e as ue,b as V,c as de,a as pe,m as he,d as me}from"../chunks/index.x_vOF7Lr.js";import{e as X}from"../chunks/each.D6YF6ztN.js";import"../chunks/transform.W7TN51b0.js";import{b as be}from"../chunks/paths.DqO9xUBo.js";function ke(t,e){return t==null||e==null?NaN:e<t?-1:e>t?1:e>=t?0:NaN}class Ce extends Map{constructor(e,s=Te){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:s}}),e!=null)for(const[n,i]of e)this.set(n,i)}get(e){return super.get(se(this,e))}has(e){return super.has(se(this,e))}set(e,s){return super.set(xe(this,e),s)}delete(e){return super.delete(ze(this,e))}}function se({_intern:t,_key:e},s){const n=e(s);return t.has(n)?t.get(n):s}function xe({_intern:t,_key:e},s){const n=e(s);return t.has(n)?t.get(n):(t.set(n,s),s)}function ze({_intern:t,_key:e},s){const n=e(s);return t.has(n)&&(s=t.get(n),t.delete(n)),s}function Te(t){return t!==null&&typeof t=="object"?t.valueOf():t}function we(t){return t}function Le(t,...e){return Se(t,Array.from,we,e)}function Se(t,e,s,n){return function i(o,v){if(v>=n.length)return s(o);const y=new Ce,c=n[v++];let l=-1;for(const m of o){const r=c(m,++l,o),a=y.get(r);a?a.push(m):y.set(r,[m])}for(const[m,r]of y)y.set(m,i(r,v));return e(y)}(t,0)}async function Me(t){if("clipboard"in navigator)await navigator.clipboard.writeText(t);else{const e=document.createElement("input");e.type="text",e.disabled=!0,e.style.setProperty("position","fixed"),e.style.setProperty("z-index","-100"),e.style.setProperty("pointer-events","none"),e.style.setProperty("opacity","0"),e.value=t,document.body.appendChild(e),e.click(),e.select(),document.execCommand("copy"),document.body.removeChild(e)}}const Ie=(t,e)=>{async function s(){if(i)try{await Me(i),t.dispatchEvent(new CustomEvent("svelte-copy",{detail:i}))}catch(o){t.dispatchEvent(new CustomEvent("svelte-copy:error",{detail:o}))}}let n=typeof e=="string"?["click"]:[e.events].flat(1),i=typeof e=="string"?e:e.text;return n.forEach(o=>{t.addEventListener(o,s,!0)}),{update:o=>{const v=typeof o=="string"?["click"]:[o.events].flat(1),y=typeof o=="string"?o:o.text,c=v.filter(m=>!n.includes(m)),l=n.filter(m=>!v.includes(m));c.forEach(m=>{t.addEventListener(m,s,!0)}),l.forEach(m=>{t.removeEventListener(m,s,!0)}),n=v,i=y},destroy:()=>{n.forEach(o=>{t.removeEventListener(o,s,!0)})}}};function Ne(t){let e,s,n,i,o,v,y,c,l,m,r,a="CSS Snippet",h,g,j,I,D,T,w="Copy CSS to Clipboard",B,z,N,F,G;return{c(){e=C("link"),s=S(),n=C("div"),i=C("h3"),o=H(t[0]),v=S(),y=C("p"),c=H(t[1]),l=S(),m=C("details"),r=C("summary"),r.textContent=a,h=S(),g=C("code"),j=H(t[2]),I=S(),D=C("p"),T=C("button"),T.textContent=w,z=C("span"),N=H(t[3]),this.h()},l(b){const f=ye("svelte-1uevrx3",document.head);e=x(f,"LINK",{rel:!0,href:!0}),f.forEach(k),s=M(b),n=x(b,"DIV",{style:!0,class:!0});var P=L(n);i=x(P,"H3",{class:!0});var u=L(i);o=O(u,t[0]),u.forEach(k),v=M(P),y=x(P,"P",{});var _=L(y);c=O(_,t[1]),_.forEach(k),l=M(P),m=x(P,"DETAILS",{class:!0});var d=L(m);r=x(d,"SUMMARY",{class:!0,"data-svelte-h":!0}),W(r)!=="svelte-1p4cxwi"&&(r.textContent=a),h=M(d),g=x(d,"CODE",{class:!0});var A=L(g);j=O(A,t[2]),A.forEach(k),d.forEach(k),I=M(P),D=x(P,"P",{});var q=L(D);T=x(q,"BUTTON",{class:!0,"data-svelte-h":!0}),W(T)!=="svelte-v2s51m"&&(T.textContent=w),z=x(q,"SPAN",{class:!0});var J=L(z);N=O(J,t[3]),J.forEach(k),q.forEach(k),P.forEach(k),this.h()},h(){E(e,"rel","external stylesheet"),E(e,"href",t[5]),E(i,"class","svelte-19ry7n"),Y(y,"font-size",t[4]),E(r,"class","svelte-19ry7n"),E(g,"class","svelte-19ry7n"),E(m,"class","svelte-19ry7n"),E(T,"class","svelte-19ry7n"),E(z,"class","svelte-19ry7n"),Y(n,"font-family","'"+t[0]+"'"),E(n,"class","svelte-19ry7n")},m(b,f){p(document.head,e),R(b,s,f),R(b,n,f),p(n,i),p(i,o),p(n,v),p(n,y),p(y,c),p(n,l),p(n,m),p(m,r),p(m,h),p(m,g),p(g,j),p(n,I),p(n,D),p(D,T),p(D,z),p(z,N),F||(G=[_e(B=Ie.call(null,T,t[2])),Q(T,"svelte-copy",t[6])],F=!0)},p(b,[f]){f&1&&K(o,b[0]),f&2&&K(c,b[1]),f&16&&Y(y,"font-size",b[4]),f&4&&K(j,b[2]),B&&ve(B.update)&&f&4&&B.update.call(null,b[2]),f&8&&K(N,b[3]),f&1&&Y(n,"font-family","'"+b[0]+"'")},i:$,o:$,d(b){b&&(k(s),k(n)),k(e),F=!1,ae(G)}}}function Pe(t,e,s){let n,{id:i=""}=e,{family:o=""}=e,{size:v=16}=e,{text:y}=e,c="",l="";const m=`${be}/assets/demo/fonts/${i}.css`,r=()=>{s(3,l="Copied!"),setTimeout(()=>{s(3,l="")},1e3)};return ge(async()=>{const a=await fetch(m);s(2,c=await a.text())}),t.$$set=a=>{"id"in a&&s(7,i=a.id),"family"in a&&s(0,o=a.family),"size"in a&&s(8,v=a.size),"text"in a&&s(1,y=a.text)},t.$$.update=()=>{t.$$.dirty&256&&s(4,n=`${v}px`)},[o,y,c,l,n,m,r,i,v]}class Ae extends te{constructor(e){super(),ne(this,e,Pe,Ne,ee,{id:7,family:0,size:8,text:1})}}const De=[{id:"atkinson",family:"Atkinson",type:"sans-serif"},{id:"atlas",family:"Atlas Grotesk",type:"sans-serif"},{id:"baloo-bhai",family:"Baloo Bhai",type:"sans-serif"},{id:"canela",family:"Canela",type:"serif"},{id:"computer-modern",family:"Computer Modern",type:"serif"},{id:"cozette",family:"Cozette",type:"other"},{id:"inter",family:"Inter",type:"sans-serif"},{id:"jamboree",family:"Jamboree",type:"other"},{id:"jersey",family:"Jersey M54",type:"other"},{id:"lyon",family:"Lyon Display",type:"serif"},{id:"metropolis",family:"Metropolis",type:"sans-serif"},{id:"national",family:"National 2 Web",type:"sans-serif"},{id:"publico",family:"Publico Text",type:"serif"},{id:"recoleta",family:"Recoleta",type:"serif"},{id:"rubik",family:"Rubik",type:"sans-serif"},{id:"inconsolata",family:"Inconsolata",type:"mono"},{id:"spacemono",family:"Space Mono",type:"mono"},{id:"tiempos",family:"Tiempos Text",type:"serif"}];function le(t,e,s){const n=t.slice();return n[5]=e[s][0],n[6]=e[s][1],n}function oe(t,e,s){const n=t.slice();return n[9]=e[s].family,n[10]=e[s].id,n}function re(t){let e,s;return e=new Ae({props:{id:t[10],family:t[9],size:t[0],text:t[1]}}),{c(){de(e.$$.fragment)},l(n){pe(e.$$.fragment,n)},m(n,i){he(e,n,i),s=!0},p(n,i){const o={};i&1&&(o.size=n[0]),i&2&&(o.text=n[1]),e.$set(o)},i(n){s||(U(e.$$.fragment,n),s=!0)},o(n){V(e.$$.fragment,n),s=!1},d(n){me(e,n)}}}function ie(t){let e,s=t[5]+"",n,i,o,v,y,c=X(t[6]),l=[];for(let r=0;r<c.length;r+=1)l[r]=re(oe(t,c,r));const m=r=>V(l[r],1,1,()=>{l[r]=null});return{c(){e=C("h2"),n=H(s),i=S(),o=C("section");for(let r=0;r<l.length;r+=1)l[r].c();v=S(),this.h()},l(r){e=x(r,"H2",{});var a=L(e);n=O(a,s),a.forEach(k),i=M(r),o=x(r,"SECTION",{class:!0});var h=L(o);for(let g=0;g<l.length;g+=1)l[g].l(h);v=M(h),h.forEach(k),this.h()},h(){E(o,"class","svelte-1lzc8ku")},m(r,a){R(r,e,a),p(e,n),R(r,i,a),R(r,o,a);for(let h=0;h<l.length;h+=1)l[h]&&l[h].m(o,null);p(o,v),y=!0},p(r,a){if(a&7){c=X(r[6]);let h;for(h=0;h<c.length;h+=1){const g=oe(r,c,h);l[h]?(l[h].p(g,a),U(l[h],1)):(l[h]=re(g),l[h].c(),U(l[h],1),l[h].m(o,v))}for(ce(),h=c.length;h<l.length;h+=1)m(h);ue()}},i(r){if(!y){for(let a=0;a<c.length;a+=1)U(l[a]);y=!0}},o(r){l=l.filter(Boolean);for(let a=0;a<l.length;a+=1)V(l[a]);y=!1},d(r){r&&(k(e),k(i),k(o)),fe(l,r)}}}function Be(t){let e,s,n="Hosted Fonts on The Pudding",i,o,v="<em>Do not use fonts hosted by The Pudding without written permission.</em>",y,c,l,m,r,a,h,g,j,I,D="text sample",T,w,B,z,N,F,G,b=X(t[2]),f=[];for(let u=0;u<b.length;u+=1)f[u]=ie(le(t,b,u));const P=u=>V(f[u],1,1,()=>{f[u]=null});return{c(){e=C("div"),s=C("h1"),s.textContent=n,i=S(),o=C("p"),o.innerHTML=v,y=S(),c=C("form"),l=C("label"),m=H("font-size: "),r=H(t[0]),a=H("px"),h=S(),g=C("input"),j=S(),I=C("label"),I.textContent=D,T=S(),w=C("input"),B=S(),z=C("article");for(let u=0;u<f.length;u+=1)f[u].c();this.h()},l(u){e=x(u,"DIV",{id:!0,class:!0});var _=L(e);s=x(_,"H1",{"data-svelte-h":!0}),W(s)!=="svelte-1m2hcwq"&&(s.textContent=n),i=M(_),o=x(_,"P",{"data-svelte-h":!0}),W(o)!=="svelte-895ja5"&&(o.innerHTML=v),y=M(_),c=x(_,"FORM",{});var d=L(c);l=x(d,"LABEL",{for:!0,class:!0});var A=L(l);m=O(A,"font-size: "),r=O(A,t[0]),a=O(A,"px"),A.forEach(k),h=M(d),g=x(d,"INPUT",{id:!0,type:!0,min:!0,max:!0}),j=M(d),I=x(d,"LABEL",{for:!0,class:!0,"data-svelte-h":!0}),W(I)!=="svelte-16zo6eo"&&(I.textContent=D),T=M(d),w=x(d,"INPUT",{id:!0,type:!0,maxlength:!0}),d.forEach(k),_.forEach(k),B=M(u),z=x(u,"ARTICLE",{class:!0});var q=L(z);for(let J=0;J<f.length;J+=1)f[J].l(q);q.forEach(k),this.h()},h(){E(l,"for","size"),E(l,"class","svelte-1lzc8ku"),E(g,"id","size"),E(g,"type","range"),E(g,"min","12"),E(g,"max","48"),E(I,"for","text"),E(I,"class","svelte-1lzc8ku"),E(w,"id","text"),E(w,"type","text"),E(w,"maxlength","100"),E(e,"id","info"),E(e,"class","svelte-1lzc8ku"),E(z,"class","svelte-1lzc8ku")},m(u,_){R(u,e,_),p(e,s),p(e,i),p(e,o),p(e,y),p(e,c),p(c,l),p(l,m),p(l,r),p(l,a),p(c,h),p(c,g),Z(g,t[0]),p(c,j),p(c,I),p(c,T),p(c,w),Z(w,t[1]),R(u,B,_),R(u,z,_);for(let d=0;d<f.length;d+=1)f[d]&&f[d].m(z,null);N=!0,F||(G=[Q(g,"change",t[3]),Q(g,"input",t[3]),Q(w,"input",t[4])],F=!0)},p(u,[_]){if((!N||_&1)&&K(r,u[0]),_&1&&Z(g,u[0]),_&2&&w.value!==u[1]&&Z(w,u[1]),_&7){b=X(u[2]);let d;for(d=0;d<b.length;d+=1){const A=le(u,b,d);f[d]?(f[d].p(A,_),U(f[d],1)):(f[d]=ie(A),f[d].c(),U(f[d],1),f[d].m(z,null))}for(ce(),d=b.length;d<f.length;d+=1)P(d);ue()}},i(u){if(!N){for(let _=0;_<b.length;_+=1)U(f[_]);N=!0}},o(u){f=f.filter(Boolean);for(let _=0;_<f.length;_+=1)V(f[_]);N=!1},d(u){u&&(k(e),k(B),k(z)),fe(f,u),F=!1,ae(G)}}}function je(t,e,s){let n=18,i="The quick brown fox jumps over the lazy dog.";const o=Le(De,c=>c.type);o.sort((c,l)=>ke(c[1].length,l[1].length));function v(){n=Ee(this.value),s(0,n)}function y(){i=this.value,s(1,i)}return[n,i,o,v,y]}class He extends te{constructor(e){super(),ne(this,e,je,Be,ee,{})}}function Oe(t){let e,s;return e=new He({}),{c(){de(e.$$.fragment)},l(n){pe(e.$$.fragment,n)},m(n,i){he(e,n,i),s=!0},p:$,i(n){s||(U(e.$$.fragment,n),s=!0)},o(n){V(e.$$.fragment,n),s=!1},d(n){me(e,n)}}}class Ve extends te{constructor(e){super(),ne(this,e,null,Oe,ee,{})}}export{Ve as component};
