const form = document.getElementById('cadastrar');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const btn = document.getElementById('continuar');

    // Feedback visual básico
    btn.innerText = 'Enviando...';
    btn.disabled = true;

    try {
        const response = await fetch('enviar-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Sucesso! Verifique seu e-mail.');
        } else {
            alert('Erro: ' + result.error);
        }
    } catch (err) {
        alert('Erro na conexão com o servidor.');
    } finally {
        btn.innerText = 'CONTINUAR';
        btn.disabled = false;
    }

});
