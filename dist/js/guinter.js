$(document).ready(function(){
	$("#CaixaValor").keypress(NumerosPontosVirgulas);
    $("#CaixaEstoque").keypress(NumerosPontosVirgulas);
    $("#CampoPesquisa").keypress(SomenteNumeros);
	$('#Adicionar').show();
	$("#CaixaValor").maskMoney({showSymbol:true, symbol:"", decimal:".", thousands:","});
	inicio();
	getJSON();
});

//variável que chamam os endereços.
var	url="http://localhost:3000/product/";
var mensagens = {
	invalidez:"OPS! Esta opção é inválida! Escolha outra, por favor!",
	optionNull: "Selecione uma alternativa...",
	campoNull: "Preencha corretamente os campos!",
	confirma: 'Você está certo disto?'
}

function inicio (){
	esconde(['#CampoPesquisa','#CampoSelecionar','#TabelaAdicionar']);
	mostra(['#BotaoAdicionar','#BotaoPesquisar','#BotaoSelecionar']);
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

//Apenas números inteiros
function SomenteNumeros (e){
	var texto = $("#CaixaEstoque").val();
	if ( e.which == 8 || e.which == 0 ) return true;
   	if ( e.which < 48 || e.which > 57 ) return false;
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
		esconde(['#BotaoEditar', '#BotaoDeletar']);
		mostra(['#BotaoAdicionar']);
		BotaoDeletar();
	});
	$("#BotaoAdicionar").click(function(){
		$('#Tudo').html('');
		mostra(['#TabelaAdicionar','#Adicionar']);
		esconde(['#CampoSelecionar','#CampoPesquisa','#Tudo','#Enviar','#BotaoBuscar']);
		BotaoAdicionar();
	});
	$("#BotaoEditar").click(function(){
		$('#Tudo').html('');
		mostra(['#TabelaAdicionar','#Enviar']);
		esconde(['#CampoSelecionar', '#Adicionar','#Tudo']);
		BotaoEditar();
	});
	$("#BotaoPesquisar").click(function(){
		esconde(['#TabelaAdicionar','#CampoSelecionar','#Tudo'])
		mostra(['#CampoPesquisa','#BotaoBuscar']);
		//$("#CampoPesquisa").show();
	});
	$("#BotaoBuscar").click(function(){
		var codigo = $('#CampoPesquisa').val();
		buscar(codigo);
	});
	$("#BotaoSelecionar").click(function(){
		esconde(['#TabelaAdicionar','#CampoPesquisa','#BotaoBuscar','#Tudo'])
		$("#CampoSelecionar").show();
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
		requesicaoEscritas(url + z);
	}
	else{
		alert(mensagens.invalidez);
	}
}

function requesicaoEscritas(endereco){
	$.getJSON(endereco, function(database){
		mostra(['#BotaoEditar', '#BotaoDeletar']);
		Escritas(database);
	})
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
	mostra(['#CampoSelecionar']);
	esconde(['#Select','#BotaoExibir']);
}

//função que apaga a opção quando o botão 'Deletar' for pressionado.
function BotaoDeletar(){
	var z = $('#Select').val();
	if(confirm(mensagens.confirma)) ajax(url + z, 'DELETE', '');
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
	esconde(['#TabelaAdicionar','#CampoPesquisa','#CampoSelecionar'])
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
			if(confirm(mensagens.confirma)){
				//$('#Adicionar').hide();
				//$('#BotaoAdicionar').show();
				ajax(url, 'POST', data);
			}
		}
		else alert(mensagens.campoNull);
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
			if(confirm(mensagens.confirma)){	
				$('#Enviar').hide();
				$('#BotaoAdicionar').show();
				ajax(url + z, 'PUT', data);
			}
		}
		else alert(mensagens.campoNull);
	})
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