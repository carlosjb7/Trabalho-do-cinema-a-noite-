// Máscara CPF
function maskCPF() {
    let cpf = document.getElementById("cpf");
    let value = cpf.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpf.value = value;
}

// Apenas para evitar erro caso a página não use formCadastro
document.getElementById("formCadastro")?.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Este site está em modo offline. Cadastros não são salvos.");
});
