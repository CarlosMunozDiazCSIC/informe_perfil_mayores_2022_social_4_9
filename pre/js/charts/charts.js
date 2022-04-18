//Desarrollo de las visualizaciones
import * as d3 from 'd3';
//import { numberWithCommas2 } from './helpers';
//import { getInTooltip, getOutTooltip, positionTooltip } from './modules/tooltip';
import { setChartHeight } from '../modules/height';
import { setChartCanvas, setChartCanvasImage } from '../modules/canvas-image';
import { setRRSSLinks } from '../modules/rrss';
import { setFixedIframeUrl } from './chart_helpers';

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C', 
COLOR_PRIMARY_2 = '#E37A42', 
COLOR_ANAG_1 = '#D1834F', 
COLOR_ANAG_2 = '#BF2727', 
COLOR_COMP_1 = '#528FAD', 
COLOR_COMP_2 = '#AADCE0', 
COLOR_GREY_1 = '#B5ABA4', 
COLOR_GREY_2 = '#64605A', 
COLOR_OTHER_1 = '#B58753', 
COLOR_OTHER_2 = '#731854';

export function initChart(iframe) {
    //Lectura de datos
    d3.csv('https://raw.githubusercontent.com/CarlosMunozDiazCSIC/informe_perfil_mayores_2022_social_4_9/main/data/personas_felices_2018_eurostat_v2.csv', function(error,data) {
        if (error) throw error;

        let margin = {top: 10, right: 10, bottom: 20, left: 30},
            width = document.getElementById('chart').clientWidth - margin.left - margin.right,
            height = document.getElementById('chart').clientHeight - margin.top - margin.bottom;

        let svg = d3.select("#chart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let edades = d3.map(data, function(d){return(d.Edades)}).keys();
        let tipos = ['ESPAÑA_TOTAL', 'EU_28_TOTAL'];

        let x = d3.scaleBand()
            .domain(edades)
            .range([0, width])
            .padding([0.35]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        let y = d3.scaleLinear()
            .domain([0, 100])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        let xSubgroup = d3.scaleBand()
            .domain(tipos)
            .range([0, x.bandwidth()])
            .padding([0]);

        let color = d3.scaleOrdinal()
            .domain(tipos)
            .range([COLOR_PRIMARY_1, COLOR_COMP_1]);

        function init() {
            svg.append("g")
                .selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr("transform", function(d) { return "translate(" + x(d.Edades) + ",0)"; })
                .selectAll("rect")
                .data(function(d) { return tipos.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter()
                .append("rect")
                .attr('class', 'prueba')
                .attr("x", function(d) { return xSubgroup(d.key); })
                .attr("width", xSubgroup.bandwidth())
                .attr("fill", function(d) { return color(d.key); })
                .attr("y", function(d) { return y(0); })                
                .attr("height", function(d) { return height - y(0); })
                .transition()
                .duration(2000)
                .attr("y", function(d) { return y(d.value); })                
                .attr("height", function(d) { return height - y(d.value); });
        }

        function animateChart() {
            svg.selectAll(".prueba")
                .attr("x", function(d) { return xSubgroup(d.key); })
                .attr("width", xSubgroup.bandwidth())
                .attr("fill", function(d) { return color(d.key); })
                .attr("y", function(d) { return y(0); })                
                .attr("height", function(d) { return height - y(0); })
                .transition()
                .duration(2000)
                .attr("y", function(d) { return y(d.value); })                
                .attr("height", function(d) { return height - y(d.value); });
        }

        /////
        /////
        // Resto - Chart
        /////
        /////
        init();

        //Animación del gráfico
        document.getElementById('replay').addEventListener('click', function() {
            animateChart();
        });

        /////
        /////
        // Resto
        /////
        /////

        //Iframe
        setFixedIframeUrl('informe_perfil_mayores_2022_social_4_9','personas_felices_europa');

        //Redes sociales > Antes tenemos que indicar cuál sería el texto a enviar
        setRRSSLinks('personas_felices_europa');

        //Captura de pantalla de la visualización
        setChartCanvas();   

        let pngDownload = document.getElementById('pngImage');

        pngDownload.addEventListener('click', function(){
            setChartCanvasImage('personas_felices_europa');
        });

        //Altura del frame
        setChartHeight(iframe);
    });    
}