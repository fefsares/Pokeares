const P = new Pokedex.Pokedex()

function capitalize(texto){
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}

//PROCURAR
function chamar_procurar (poke_chamar){
    document.getElementById("habilidades").innerHTML = ''

    const tipo = poke_chamar.types[0].type.name

    document.getElementById("name_img_id").style.setProperty("background", `linear-gradient(135deg, var(--${tipo}), var(--${tipo}Light))`)
    document.getElementById("name_img_id").style.setProperty("color", `var(--${tipo}Dark)`)

    document.getElementById("poke_img").innerHTML = "<img src='" + poke_chamar.sprites.other["official-artwork"].front_default + "'>"
    document.getElementById("poke_name").innerHTML = capitalize(poke_chamar.name)
    document.getElementById("poke_id").innerHTML = 'ID: ' + poke_chamar.id + '<br>' + capitalize(tipo) 

    document.getElementById("poke_infos").classList.remove("hidden")
    
    for (let i = 0; i < poke_chamar.stats.length; i++){
        document.querySelectorAll(".p_procu_stat")[i].innerHTML = poke_chamar.stats[i].base_stat
    }
    
    for (let i = 0; i < poke_chamar.abilities.length; i++){
        const idAbility = poke_chamar.abilities[i].ability.url.split('/')[6]

        document.getElementById("habilidades").innerHTML += `
        <div class="col-lg-4 col-sm-12">
            <button class='btn btn-danger' onclick= descricaoHabilidade(${idAbility})> ${capitalize(poke_chamar.abilities[i].ability.name)} </button>
        </div>
        `
    }

    document.getElementById("nomePokemon").value = ''
    
}


async function descricaoHabilidade(idAbility){
    const res = await(fetch(`https://pokeapi.co/api/v2/ability/${idAbility}`))
    const habilidade = await res.json()
    const popup = document.getElementById("popup")

    nameAbility =  habilidade.name
    efeitoAbility = habilidade.effect_entries[2].effect

    popup.classList.add("ativo")
    document.getElementById("popup-content").classList.add("ativo")
    document.getElementById("nameAbility").innerHTML = `<b> ${capitalize(nameAbility)} </b>`
    document.getElementById("descricaoAbility").innerHTML = capitalize(efeitoAbility)
}

function fechar_habilidade (){
    const popup = document.getElementById("popup")
    popup.classList.remove("ativo")
    document.getElementById("popup-content").classList.remove("ativo")
}

async function buscar() {
    const pokemon_digitado = document.getElementById("nomePokemon").value
    try {
        const pokemon = await P.getPokemonByName(pokemon_digitado)
        chamar_procurar(pokemon)
    } catch (erro) {
        alert("Insira um Pokémon ou ID válido")
    }
}

async function randomPoke() {
    rng = Math.floor(Math.random() * 1026);

    const pokemon = await P.getPokemonByName(rng)

    chamar_procurar(pokemon)

}

// function randomPoke() {
    
//     rng = Math.floor(Math.random() * 1026);

//     const pokemon_random = rng

//     P.resource([
//         `/api/v2/pokemon/${pokemon_random}` ]).then(response =>{
//             pokemon = response[0]
//             document.getElementById("pokemon").innerHTML = "<img src='" + pokemon.sprites.other["official-artwork"].front_default + "'>"
//     })

// }


//QUIZ

let vq = 0
let fq = 0
let total = 0

function resposta(btn_value, name_poke){
    if (btn_value === name_poke){
        document.getElementById("resultado").innerHTML = "ACERTOU!!"
        document.getElementById("resultado").classList.add("resultado_animacao")
        document.getElementById("resultado").style.color = "#285e29";

        vq+=1
    }
    else {
        document.body.classList.add("vibrando");
        document.getElementById("resultado").innerHTML = "ERROU!!"
        document.getElementById("resultado").classList.add("resultado_animacao")
        document.getElementById("resultado").style.color = "#962821";

        fq+=1
    }
    setTimeout(() => {
        document.getElementById("resultado").classList.remove("resultado_animacao")
        document.body.classList.remove("vibrando");
    }, 300);
    setTimeout(() => {
            document.getElementById("resultado").innerHTML = ""
            randomQuiz()
        }, 1000);

    total +=1

}

function chamar_quiz (opcoes, correto){
    document.getElementById("quiz").classList.remove('d-none');
    document.getElementById("poke_img").innerHTML = "<img src='" + correto.sprites.other["official-artwork"].front_default + "'>"
    document.getElementById("poke_name").innerHTML = "QUEM É ESSE POKEMÓN??"

    const tipo = correto.types[0].type.name
    document.getElementById("name_img").style.setProperty("background", `linear-gradient(135deg, var(--${tipo}), var(--${tipo}Light))`)
    document.getElementById("name_img").style.setProperty("color", `var(--${tipo}Dark)`)


    document.getElementById("btns-quiz").innerHTML = 
        `<div class="row g-4 justify-content-between">
            <div class="col-md-6 col-sm-12">
                <button class="btn btn-dark btn-quiz w-100" onclick="resposta('${opcoes[0].name}', '${correto.name}')">
                    ${capitalize(opcoes[0].name)}
                </button>
            </div>
            <div class="col-md-6 col-sm-12">
                <button class="btn btn-dark btn-quiz w-100" onclick="resposta('${opcoes[1].name}', '${correto.name}')">
                    ${capitalize(opcoes[1].name)}
                </button>
            </div>
            <div class="col-md-6 col-sm-12">
                <button class="btn btn-dark btn-quiz w-100" onclick="resposta('${opcoes[2].name}', '${correto.name}')">
                    ${capitalize(opcoes[2].name)}
                </button>
            </div>
            <div class="col-md-6 col-sm-12">
                <button class="btn btn-dark btn-quiz w-100" onclick="resposta('${opcoes[3].name}', '${correto.name}')">
                    ${capitalize(opcoes[3].name)}
                </button>
            </div>
        </div> 
        `
}

async function randomQuiz() {
    pv = Math.floor(Math.random() * 1026);
    f_0 = Math.floor(Math.random() * 1026);
    f_1 = Math.floor(Math.random() * 1026);
    f_2 = Math.floor(Math.random() * 1026);

    const pokemon_v = await P.getPokemonByName(pv)
    const pokemon_f0 = await P.getPokemonByName(f_0)
    const pokemon_f1 = await P.getPokemonByName(f_1)
    const pokemon_f2 = await P.getPokemonByName(f_2)

    let opcoes = [pokemon_v, pokemon_f0, pokemon_f1, pokemon_f2]

    opcoes.sort((a, b) => Math.random() - 0.5)

    document.getElementById("btn-quiz").classList.add('d-none');
    document.getElementById("btn-finalizarQuiz").classList.add('d-block');

    chamar_quiz(opcoes, pokemon_v)
}

function terminarQuiz(){
    document.getElementById("resultado").style.color = "";
    document.getElementById("resultado").innerHTML = vq + '/' + total
    document.getElementById("resultado").classList.add("resultado_animacao")
    setTimeout(() => {
        document.getElementById("quiz").classList.add('d-none');
        document.getElementById("btn-quiz").classList.remove('d-none');
        document.getElementById("btn-finalizarQuiz").classList.remove('d-block');
        document.getElementById("resultado").innerHTML = ""
        }, 1500);

    vq=0
    fq=0 
    total=0
}

//STATS
function chamar_stats (poke1, poke2){

    document.getElementById("comparacao_stats").style.minHeight = "auto"

    img1 = document.getElementById("poke_img1").innerHTML = "<img src='" + poke1.sprites.other["official-artwork"].front_default + "'>"
    name1 = document.getElementById("poke_name1").innerHTML = capitalize(poke1.name)
    id1 = document.getElementById("poke_id1").innerHTML = poke1.id

    img2 = document.getElementById("poke_img2").innerHTML = "<img src='" + poke2.sprites.other["official-artwork"].front_default + "'>"
    name2 = document.getElementById("poke_name2").innerHTML = capitalize(poke2.name)
    id2 = document.getElementById("poke_id2").innerHTML = poke2.id

    document.getElementById("nomePokemon1").value = ''
    document.getElementById("nomePokemon2").value = ''
    
}

async function buscar_stats() {
    const pokemon_digitado1 = document.getElementById("nomePokemon1").value
    const pokemon_digitado2 = document.getElementById("nomePokemon2").value

    let poke1
    let poke2

    if (pokemon_digitado1 == "" || pokemon_digitado2 == ""){
        alert("Digite dois pokemons")
    }
    else{
        try {
            poke1 = await P.getPokemonByName(pokemon_digitado1)

        } catch (erro) {
            alert("Pokémon 1 inválido")
        }


        try {
            poke2 = await P.getPokemonByName(pokemon_digitado2)

        } catch (erro) {
            alert("Pokémon 2 inválido")
        }

        chamar_stats(poke1, poke2)
        comparar_stats(poke1, poke2)
    }
}

function comparar_stats(poke1, poke2){
    document.getElementById("stats_comparar").style.removeProperty('display')
    document.getElementById("stats_comparar").style.display = 'flex'

    const tipo1 = poke1.types[0].type.name
    const tipo2 = poke2.types[0].type.name

    document.getElementById("poke1").style.setProperty("background", `linear-gradient(135deg, var(--${tipo1}), var(--${tipo1}Light))`)
    document.getElementById("poke1").style.setProperty("color", `var(--${tipo1}Dark)`)
    document.getElementById("poke2").style.setProperty("background", `linear-gradient(135deg, var(--${tipo2}), var(--${tipo2}Light))`)
    document.getElementById("poke2").style.setProperty("color", `var(--${tipo2}Dark)`)

    const stats = [
        [poke1.stats[0].base_stat, poke2.stats[0].base_stat],
        [poke1.stats[1].base_stat, poke2.stats[1].base_stat],
        [poke1.stats[2].base_stat, poke2.stats[2].base_stat],
        [poke1.stats[3].base_stat, poke2.stats[3].base_stat],
        [poke1.stats[4].base_stat, poke2.stats[4].base_stat],
        [poke1.stats[5].base_stat, poke2.stats[5].base_stat],
    ]

    const barras = document.querySelectorAll(".bar")

    barras.forEach(bar => {
        bar.querySelector(".left").style.width = "0%"
        bar.querySelector(".right").style.width = "0%"
    })
    

    setTimeout(() => {
        for (let i = 0; i < stats.length; i++){
            const stats1 = stats[i][0]
            const stats2 = stats[i][1]

            const total_stats = stats1 + stats2
            if (total_stats === 0)continue

            const porcent1 = (stats1 / total_stats) * 100;
            const porcent2 = (stats2 / total_stats) * 100;

            document.querySelectorAll(".p_stat")[i].innerHTML = stats1 + "/" + stats2

            barras[i].querySelector(".left").style.width = porcent1 + "%"; 
            barras[i].querySelector(".left").style.background = `var(--${tipo1})`

            barras[i].querySelector(".right").style.width = porcent2 + "%";
            barras[i].querySelector(".right").style.background = `var(--${tipo2})`
        }
    },50)
}


//TODOS
async function gerar_todos() {
    const geracao_value = document.getElementById("idGeracao").value
    try {
        const res = await(fetch(`https://pokeapi.co/api/v2/generation/${geracao_value}`))
        
        const geracao = await res.json()

        document.getElementById("hero").style.minHeight = "auto"

        document.getElementById("btn-gerar").disabled = true;
        document.getElementById("btn-gerar").classList.add('disabled')

        document.getElementById("poke_geracao").innerHTML = ''

        const lista = geracao.pokemon_species.sort((a, b) => {
            idA = a.url.split('/')[6]
            idB = b.url.split('/')[6]

            return idA - idB
        })

        for (let i = 0; i < geracao.pokemon_species.length; i++){

            const resSpecies = await fetch(lista[i].url)
            const speciesData = await resSpecies.json()

            const nomePoke = speciesData.varieties[0].pokemon.name

                const resPoke = await(fetch(`https://pokeapi.co/api/v2/pokemon/${nomePoke}`))


                const pokemon_data = await(resPoke.json())

                const tipo = pokemon_data.types[0].type.name

                document.getElementById("poke_geracao") .innerHTML += `
                    <div class="card_geracao">
                        <p class= "name_geracao"> ${capitalize(pokemon_data.name)}  ID: ${pokemon_data.id} </p> 
                        <br> 
                        <img src= ${pokemon_data.sprites.other["official-artwork"].front_default}>
                    </div>
                `
                const cards = document.querySelectorAll(".card_geracao")
                const ultimoCard = cards[cards.length - 1]

                const nome = ultimoCard.querySelector(".name_geracao")

                ultimoCard.style.background = `linear-gradient(135deg, var(--${tipo}), var(--${tipo}Light))`
                nome.style.color = `var(--${tipo}Dark)`
        }
        setTimeout(() => {
            document.getElementById("btn-gerar").disabled = false;
            document.getElementById("btn-gerar").classList.remove('disabled')
        }, 500);
    } 
    catch (erro) {
        alert("Digite uma geração válida!")
        document.getElementById("hero").style.minHeight = "100vh"
        document.getElementById("btn-gerar").disabled = false;
        document.getElementById("btn-gerar").classList.remove('disabled')
    }
}
