document.addEventListener('submit',function(event){
  if(!event.target.matches('.wpcf7-form, form.comment-form, form[role="search"]')) return;
  event.preventDefault();
  if(!event.target.reportValidity()) return;
  let status=event.target.querySelector('.wpcf7-response-output');
  if(!status){status=document.createElement('p');event.target.append(status);}
  status.classList.add('demo-form-status');status.setAttribute('role','status');status.setAttribute('aria-hidden','false');
  status.textContent='Đây là bản demo giao diện. Yêu cầu chưa được gửi; vui lòng liên hệ VNIC qua điện thoại hoặc email.';
},true);
