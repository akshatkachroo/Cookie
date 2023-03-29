const form = document.querySelector('form');
const websiteInput = document.querySelector('#website');
const resultDiv = document.querySelector('#result');

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	
	const website = websiteInput.value;
	const response = await fetch(`http://127.0.0.1:5000/cookies?website=${website}`);
	
	if (response.ok) {
		const cookies = await response.json();
		if (cookies.length > 0) {
			const tableBody = document.querySelector('#cookieTable tbody');
			tableBody.innerHTML = '';
			let priorConsentFound = false;
			let cookieNoticeFound = false;
			cookies.forEach((cookie) => {
			  const row = tableBody.insertRow();
			  const nameCell = row.insertCell();
			  const valueCell = row.insertCell();
			  const domainCell = row.insertCell();
			  const pathCell = row.insertCell();
			  const expiresCell = row.insertCell();
			  const secureCell = row.insertCell();
			  const httpOnlyCell = row.insertCell();
			  nameCell.textContent = cookie.name;
			  valueCell.textContent = cookie.value;
			  domainCell.textContent = cookie.domain;
			  pathCell.textContent = cookie.path;
			  expiresCell.textContent = cookie.expires ? new Date(cookie.expires * 1000).toString() : '';
			  secureCell.textContent = cookie.secure ? 'Yes' : 'No';
			  httpOnlyCell.textContent = cookie.httponly ? 'Yes' : 'No'; // Note: the property name is "httponly" in the Python code, not "httpOnly"
			  
			  if (cookie.name.toLowerCase() === 'consent' && cookie.value.toLowerCase() !== 'strictly necessary') {
			    priorConsentFound = true;
			  }
			  
			  if (cookie.name.toLowerCase() === 'cookie_notice_accepted' && cookie.value.toLowerCase() === 'true') {
			    cookieNoticeFound = true;
			  }
			});
			
			if (priorConsentFound) {
			  resultDiv.textContent = 'The website is not in compliance with GDPR. Prior consent is required for non-necessary cookies.';
			} else if (!cookieNoticeFound) {
			  resultDiv.textContent = 'The website is not in compliance with GDPR. A cookie notice must be provided.';
			} else {
			  resultDiv.textContent = '';
			}
		 } else {
			resultDiv.textContent = 'No cookies found for this website';
		 }
	} else {
		resultDiv.textContent = 'Error retrieving cookies';
	}
});







