$(document).ready(function(){
	$("#CaixaValor").keyup(function(){
        var numero = $(this);
        numero.val(NumerosVirgulasPontos(/[^0-9,.]+/g,'', numero.val()));
    });
    $("#CaixaEstoque").keypress(SomenteNumeros);
	$("#TabelaAdicionar").hide();
	$("#CaixaValor").maskMoney({showSymbol:true, symbol:"", decimal:".", thousands:","});
	getJSON();
});

//variável que chamam os endereços.
var	url="http://localhost:3000/product/";
var mensagens = {
	invalidez:"OPS! Esta opção é inválida! Escolha outra, por favor!",
	deleteSucesso: "A opção foi apagada com sucesso!",
	adionarSucesso: "A opção foi adicionada com sucesso!",
	optionNull: "Selecione uma alternativa...",
	campoNull: "Preencha corretamente os campos!"
}

//função que aceita números,vírgulas e pontos.
	function NumerosVirgulasPontos( texto, emBranco, campo ){
		return campo.replace( texto, emBranco );
	}
//função que aceita somente números.
	function SomenteNumeros(e){
		var texto = $("#CaixaEstoque").val();
		var indexvir = texto.indexOf(",");
     	var indexpon = texto.indexOf(".");
    	if ( e.which == 8 || e.which == 0 ) return true;
    	if ( e.which != 44 && e.which != 46 && e.which < 48 || e.which > 57 ) return false;
    	if (e.which == 44) { 
    		if (indexvir !== -1 || indexpon !== -1) return false; 
    	}
    	if (e.which == 46) { 
    		if (indexvir !== -1 || indexpon !== -1) return false; 
    	}
	}
//função que chama os itens da url.
	function getJSON(){
		$.getJSON([url], function(database){
			var alternativas='<option value="#">'+mensagens.optionNull+'</option>';
			for (var g=0; g<database.length; g++){
				alternativas+='<option value='+database[g].id + '>' + database[g].nome + '</option>';
			}
			$("#Select").html(alternativas);
			Cliques(database);	
		});
	}
//função dos botões.
	function Cliques(database){
		$("#BotaoExibir").click(function(){
			TesteVar();
		});
		$("#BotaoDeletar").click(function(){
			BotaoDeletar();
		});
		$("#BotaoAdicionar").click(function(){
			$("#TabelaAdicionar").show();
			BotaoAdicionar(database);
		});
		$("#BotaoEditar").click(function(){
			$("#TabelaAdicionar").show();

		});
	}
//função que testa a variável 'z' para que a primeira opção não seja escolhida.
	function TesteVar(z){
		var z = $('#Select').val();
		if (z>0){
			$.getJSON([url] + z, function(database){
				Escritas(database);
			})
		}
		else{
			alert(mensagens.invalidez);
		}
	}
//função que faz aparecer o ítem solicitado.
	function Escritas(database){
			$("#TabelaAdicionar").hide();
			$("#Tudo").show();
			var respostas='';
			respostas+= '<b>Produto: </b>' + database.nome + '<br>';
			respostas+= '<b>Valor:</b> R$ ' + database.valor + '<br>';
			respostas+= '<b>Status: </b>' + database.status + '<br>';
			respostas+= '<b>Estoque: </b>' + database.estoque;
			$('#Tudo').html(respostas);
	}
//função que apaga a opção quando o botão 'Deletar' for pressionado.
	function BotaoDeletar(){
		var z = $('#Select').val();
		TesteVar();
		$.ajax({
			url: [url] + z,
			type: "DELETE",
			success: function(){
				$("#TabelaAdicionar").hide();
				getJSON();
				alert(mensagens.deleteSucesso);
			}
		})
	}
//função que adiciona uma opção quando o botão 'Adicionar' for pressionado.
	function BotaoAdicionar(database){
		$("#Adicionar").click(function(database){
			var Produto = $('#CaixaProduto').val();
			var Valor = $('#CaixaValor').val();
			var Status = $('#CaixaStatus').val();
			var Estoque = $('#CaixaEstoque').val();
			if($("#CaixaProduto").val()!=='' && $("#CaixaValor").val()!=='' && $("#CaixaEstoque").val()!==''){
				$.ajax({
					url: [url],
					type: "POST",
					data: {nome: Produto,valor: Valor,status: Status,estoque: Estoque,}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ,
					success: function(){
						$("#TabelaAdicionar").hide();
						getJSON();
						alert(mensagens.adionarSucesso);
					}
				})
			}
			else alert(mensagens.campoNull);
		})
	}