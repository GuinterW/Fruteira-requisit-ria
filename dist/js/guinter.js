//variável que chamam os endereços.
var	url="http://localhost:3000/product/";
var mensagens = {
	invalidez:"OPS! Esta opção é inválida! Escolha outra, por favor!",
	optionNull: "Selecione uma alternativa...",
	campoNull: "Preencha corretamente os campos!",
	confirma: 'Você está certo disto?'
}

$(document).ready(function(){
	$("#CaixaValor").keypress(NumerosPontosVirgulas);
    $("#CaixaEstoque").keypress(NumerosPontosVirgulas);
    $("#CampoPesquisa").keypress(SomenteNumeros);
	$('#Adicionar').show();
	$("#CaixaValor").maskMoney({showSymbol:true, symbol:"", decimal:".", thousands:","});
	inicio();
	getJSON();
});

function inicio (){
	mostra(['#BotaoAdicionar','#BotaoPesquisar','#BotaoSelecionar']);
	esconde(['#itensBusca','#CampoSelecionar','#TabelaAdicionar','#BotaoDeletar','#BotaoEditar']);
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

//Apenas números inteiros
function SomenteNumeros (e){
	var texto = $("#CaixaEstoque").val();
	if ( e.which == 8 || e.which == 0 ) return true;
   	if ( e.which < 48 || e.which > 57 ) return false;
}

//função que aceita decimais.
function NumerosPontosVirgulas(e){
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

function atualizarFormulario (limpar, database){
	if(limpar){
		var Produto = $('#CaixaProduto').val('');
		var Valor = $('#CaixaValor').val('');
		var Status = $('#CaixaStatus').val('');
		var Estoque = $('#CaixaEstoque').val('');
	}
	else{
		var Produto = $('#CaixaProduto').val(database.nome);
		var Valor = $('#CaixaValor').val(database.valor);
		var Status = $('#CaixaStatus').val(database.status);
		var Estoque = $('#CaixaEstoque').val(database.estoque);
	}
}

function formulario(){
	var Produto = $('#CaixaProduto').val();
	var Valor = $('#CaixaValor').val();
	var Status = $('#CaixaStatus').val();
	var Estoque = $('#CaixaEstoque').val();
	var data = {nome: Produto,valor: Valor,status: Status,estoque: Estoque};
	return data;
}

function ajax(url, type, data){
	$.ajax({
		url: url,
		type: type,
		data: data,
		success: function(){
			$("#TabelaAdicionar").hide();
			$('#Tudo').html('').hide();
		}
	});
	esconde(['#TabelaAdicionar','#itensBusca','#CampoSelecionar','BotaoDeletar','#BotaoEditar'])
}

//função que chama os itens da url.
function getJSON(){
	$.getJSON(url, function(database){
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
		$('#Tudo').html('');
		atualizarFormulario (true, '');
		mostra(['#TabelaAdicionar','#Adicionar']);
		esconde(['#CampoSelecionar', '#itensBusca' ,'#Tudo','#Enviar','#BotaoDeletar','#BotaoEditar']);
	});
	$("#BotaoEditar").click(function(){
		mostra(['#TabelaAdicionar','#Enviar']);
		esconde(['#CampoSelecionar', '#itensBusca', '#Tudo','#Adicionar']);
	});
	$("#BotaoPesquisar").click(function(){
		mostra(['#itensBusca']);
		esconde(['#TabelaAdicionar','#CampoSelecionar','#Tudo', '#BotaoDeletar','#BotaoEditar'])
	});
	$("#BotaoBuscar").click(function(){
		var codigo = $('#CampoPesquisa').val();
		$('#Select').val(codigo);
		buscar(codigo);
	});
	$("#BotaoSelecionar").click(function(){
		mostra(['#CampoSelecionar'])
		esconde(['#TabelaAdicionar','#itensBusca','#Tudo', '#BotaoEditar', '#BotaoDeletar'])
	});


	$("#Adicionar").click(function(){
		var data = formulario();
		if($("#CaixaProduto").val()!=='' && $("#CaixaValor").val()!=='' && $("#CaixaEstoque").val()!==''){
			if(confirm(mensagens.confirma)){
				ajax(url, 'POST', data);
			}
		}
		else alert(mensagens.campoNull);
	})

	$("#Enviar").click(function(){
		var z = $('#Select').val();
		var data = formulario();
		if($("#CaixaProduto").val()!=='' && $("#CaixaValor").val()!=='' && $("#CaixaEstoque").val()!==''){
			if(confirm(mensagens.confirma)){	
				$('#BotaoAdicionar').show();
				ajax(url + z, 'PUT', data);
			}
		}
		else alert(mensagens.campoNull);
	})

}

//função que apaga a opção quando o botão 'Deletar' for pressionado.
function BotaoDeletar(){
	var z = $('#Select').val();
	if(confirm(mensagens.confirma)) {ajax(url + z, 'DELETE', '')};
}

//função que testa a variável 'z' para que a primeira opção não seja escolhida.
function TesteVar(z){
	var z = $('#Select').val();
	if (z>0){
		requesicaoEscritas(url + z);
	}
	else{
		alert(mensagens.invalidez);
	}
}

function buscar(codigo){
	if(codigo>0){
        requesicaoEscritas(url+codigo);
    }
    else{
        alert(mensagens.invalidez);
    }
    $('#CampoPesquisa').val('');
}

function requesicaoEscritas(endereco){
	$.getJSON(endereco, function(database){
		mostra(['#BotaoEditar', '#BotaoDeletar']);
		Escritas(database);
	})
	.fail(function() {
		esconde (['#Tudo','#CampoSelecionar'])
        alert (mensagens.invalidez);
    })
}

//função que faz aparecer o ítem solicitado.
function Escritas(database){
	$("#TabelaAdicionar").hide();
	$("#Tudo").show();
	var respostas='';
	respostas+= '<b>Produto: </b>' + database.nome + '<br>';
	respostas+= '<b>Código: </b>' + database.id + '<br>';
	respostas+= '<b>Valor:</b> R$ ' + database.valor + '<br>';
	respostas+= '<b>Status: </b>' + database.status + '<br>';
	respostas+= '<b>Estoque: </b>' + database.estoque;
	atualizarFormulario(false, database);
	$('#Tudo').html(respostas);
	mostra(['#BotaoEditar','#BotaoDeletar']);
}