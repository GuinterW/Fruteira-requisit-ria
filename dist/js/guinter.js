$(document).ready(function(){
	$("#CaixaValor").keyup(function(){
        var numero = $(this);
        numero.val(NumerosVirgulasPontos(/[^0-9,.]+/g,'', numero.val()));
    });
    $("#CaixaEstoque").keypress(SomenteNumeros);
	$("#TabelaAdicionar").hide();
	$('#Adicionar').show();
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
		mostra(['#BotaoEditar', '#BotaoDeletar', '#BotaoAdicionar']);
		TesteVar();
	});
	$("#BotaoDeletar").click(function(){
		esconde(['#BotaoEditar', '#BotaoDeletar']);
		mostra(['#BotaoAdicionar']);
		BotaoDeletar();
	});
	$("#BotaoAdicionar").click(function(){
		$("#TabelaAdicionar").show();
		$('#Tudo').html('').hide();
		$(this).hide();
		$('#Enviar').hide();
		esconde(['#BotaoEditar', '#BotaoDeletar', '#BotaoAdicionar', '#Enviar']);
		$('#Adicionar').show();
		BotaoAdicionar();
	});
	$("#BotaoEditar").click(function(){
		$("#TabelaAdicionar").show();
		$('#Tudo').html('').hide();
		esconde(['#BotaoEditar', '#BotaoDeletar', '#BotaoAdicionar', '#Adicionar']);
		$('#Enviar').show();
		BotaoEditar();
	});
}

function esconde(itens){
	for(var x=0; x<itens.length; x++){
		$(itens[x]).stop().hide();
	}
}

function mostra(itens){
	for(var x=0; x<itens.length; x++){
		$(itens[x]).stop().show();
	}
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
	ajax(url + z, 'DELETE', mensagens.deleteSucesso, '');
}

function ajax(url, type, mensagem, data){
	$.ajax({
		url: url,
		type: type,
		data: data,
		success: function(){
			$("#TabelaAdicionar").hide();
			$('#Tudo').html('').hide();
			getJSON();
			alert(mensagem);
		}
	})
}


//função que adiciona uma opção quando o botão 'Adicionar' for pressionado.
function BotaoAdicionar(){
	$("#Adicionar").click(function(){
		var Produto = $('#CaixaProduto').val();
		var Valor = $('#CaixaValor').val();
		var Status = $('#CaixaStatus').val();
		var Estoque = $('#CaixaEstoque').val();
		var data = {nome: Produto,valor: Valor,status: Status,estoque: Estoque};
		if($("#CaixaProduto").val()!=='' && $("#CaixaValor").val()!=='' && $("#CaixaEstoque").val()!==''){
			ajax(url, 'POST', mensagens.adionarSucesso, data);
		}
		else alert(mensagens.campoNull);
		$('#Adicionar').hide();
		$('#BotaoAdicionar').show();
	})
}

function BotaoEditar(){
	$("#Enviar").click(function(){
		var z = $('#Select').val();
		var Produto = $('#CaixaProduto').val();
		var Valor = $('#CaixaValor').val();
		var Status = $('#CaixaStatus').val();
		var Estoque = $('#CaixaEstoque').val();
		var data = {nome: Produto,valor: Valor,status: Status,estoque: Estoque};
		if($("#CaixaProduto").val()!=='' && $("#CaixaValor").val()!=='' && $("#CaixaEstoque").val()!==''){
			ajax(url + z, 'PUT', mensagens.adionarSucesso, data);
		}
		else alert(mensagens.campoNull);
		$('#Enviar').hide();
		$('#BotaoEditar').show();
	})
}