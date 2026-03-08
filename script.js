const form = document.getElementById('cadastrar');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const btn = document.getElementById('continuar');

    btn.innerText = 'Enviando...';
    btn.disabled = true;

    try {
        const response = await fetch('/api/enviar-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            alert('Código enviado! Verifique sua caixa de entrada.');
        } else {
            alert('Erro ao enviar. Verifique se o e-mail é o mesmo da sua conta Resend.');
        }
    } catch (err) {
        alert('Erro de conexão.');
    } finally {
        btn.innerText = 'CONTINUAR';
        btn.disabled = false;
    }
});
