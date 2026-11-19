(function(){
  var slides=[].slice.call(document.querySelectorAll('.slide')),dots=document.getElementById('dots'),i=0,t;
  slides.forEach(function(_,n){var b=document.createElement('button');b.setAttribute('aria-label','Review '+(n+1));b.onclick=function(){go(n)};dots.appendChild(b)});
  function go(n){i=(n+slides.length)%slides.length;slides.forEach(function(s,k){s.classList.toggle('active',k===i)});[].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===i)});clearInterval(t);t=setInterval(function(){go(i+1)},6000)}
  document.querySelector('.prev').onclick=function(){go(i-1)};document.querySelector('.next').onclick=function(){go(i+1)};
  go(0);document.getElementById('yr').textContent=new Date().getFullYear();
})();
