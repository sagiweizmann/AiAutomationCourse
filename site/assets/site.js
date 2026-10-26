/* Course site behaviour: theme toggle, copy buttons, saved checkboxes. No external code. */
(function(){
  var KEY='aiac-site:';
  function get(k){try{return localStorage.getItem(KEY+k);}catch(e){return null;}}
  function set(k,v){try{localStorage.setItem(KEY+k,v);}catch(e){}}
  var root=document.documentElement;
  var t=get('theme'); if(t) root.setAttribute('data-theme',t);
  document.querySelectorAll('.theme').forEach(function(b){b.addEventListener('click',function(){
    var cur=root.getAttribute('data-theme');
    var dark=cur?cur==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    var nt=dark?'light':'dark'; root.setAttribute('data-theme',nt); set('theme',nt);
  });});
  document.querySelectorAll('.copybox').forEach(function(box){
    var src=box.querySelector('pre,.material'); if(!src) return;
    var b=document.createElement('button'); b.type='button'; b.className='copy'; b.textContent='העתקה';
    if(src.classList.contains('rtl')||src.classList.contains('material')) b.classList.add('dark');
    function ok(){b.textContent='הועתק ✓';setTimeout(function(){b.textContent='העתקה';},1500);}
    b.addEventListener('click',function(){
      var txt=src.innerText.replace(/^\s+|\s+$/g,'');
      function fallback(){var ta=document.createElement('textarea');ta.value=txt;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');ok();}catch(e){}ta.remove();}
      if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(txt).then(ok,fallback);}else{fallback();}
    });
    box.appendChild(b);
  });
  var page=document.body.getAttribute('data-page')||'page';
  document.querySelectorAll('.check li').forEach(function(li,i){
    var id=page+':chk:'+(li.closest('[id]')?li.closest('[id]').id:'x')+':'+i;
    if(get(id)==='1') li.classList.add('done');
    li.addEventListener('click',function(){li.classList.toggle('done');set(id,li.classList.contains('done')?'1':'0');});
  });
  var boxes=document.querySelectorAll('input.done-ex');
  function upd(){
    var n=0;
    boxes.forEach(function(c){var ex=document.getElementById(c.getAttribute('data-ex'));if(ex)ex.classList.toggle('is-done',c.checked);
      var a=document.querySelector('.toc a[href="#'+c.getAttribute('data-ex')+'"]');if(a)a.classList.toggle('is-done',c.checked);if(c.checked)n++;});
    var bar=document.getElementById('pbar'),txt=document.getElementById('ptxt');
    if(bar) bar.style.width=(boxes.length?n/boxes.length*100:0)+'%';
    if(txt) txt.textContent=n+'/'+boxes.length;
  }
  boxes.forEach(function(c){
    var id=page+':done:'+c.getAttribute('data-ex');
    c.checked=get(id)==='1';
    c.addEventListener('change',function(){set(id,c.checked?'1':'0');upd();});
  });
  upd();
})();
