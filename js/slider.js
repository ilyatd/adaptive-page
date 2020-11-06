'use strict';
console.log(document.getElementsByTagName('main'));

// получение всех кнопок управления слайдерами на странице
let leftArrows = document.querySelectorAll('.slider__left');
let rightArrows = document.querySelectorAll('.slider__right');

window.addEventListener('load', function() {
    // установка слушателей нажатия на кнопки управления слайдерами
    leftArrows.forEach( leftArrow => {
        leftArrow.addEventListener('click', moveLeft);
    });
    rightArrows.forEach( rightArrow => {
        rightArrow.addEventListener('click', moveRight);
    });
    // инициализация слайдеров
    slidersInit();
    let widthWindow = document.querySelector('body').clientWidth; // ширина экрана
    // отслеживание ширины экрана
    setInterval(function() {
        if (widthWindow !== document.querySelector('body').clientWidth) {
            widthWindow = document.querySelector('body').clientWidth;
            setTimeout(slidersInit(), 500);
            // slidersInit();
        }
    }, 500);
});

/**
 * функция рассчета количества отображаемых слайдов
 * расставляет слайды в начальные позиции
 */
function slidersInit() {
    let sliderItems = document.querySelectorAll('.slider__items');
    for (let boxSlides of sliderItems){
        let leftArrowSlide = boxSlides.previousElementSibling;
        let rightArrowSlide = boxSlides.nextElementSibling;
        let slidesArray = boxSlides.children;
        // стартовый стиль отображения блока слайдера
        boxSlides.style.display = "block"; 
        leftArrowSlide.style.display = "inline-block"; 
        rightArrowSlide.style.display = "inline-block";
        boxSlides.style.position = "relative";

        setTimeout(function() {
            let widthSlide = boxSlides.firstElementChild.clientWidth; // ширина одного слайда
            // установка начального позиционирования одного слайда
            for (let slide of slidesArray) {
                slide.style.display = "none";
                slide.style.position = "absolute";
            };
            let widthBoxSlides = boxSlides.clientWidth; // ширина контейнера для слайдов
            let visibleSlidesCount = Math.trunc(widthBoxSlides / widthSlide); // количество полностью помещающихся слайдов в контейнер
            let marginSlide = parseFloat((widthBoxSlides - widthSlide * visibleSlidesCount) / (visibleSlidesCount + 1)); // отступы между слайдами
            let intervalPositionSlide = parseFloat((widthSlide + marginSlide) * 100 / widthBoxSlides); // интервал между начальными положениями слайдов (в процентах от ширины контейнера)
            let slidePosition = marginSlide / 2; // начальная позиция первого видимого слайда
            if (slidesArray.length <= visibleSlidesCount) {
                // если все слайды умещаются внутри видимой части слайдера убираем кнопки
                // управления и меняем способ позиционирования на flex
                leftArrowSlide.style.display = "none";
                rightArrowSlide.style.display = "none";
                boxSlides.style.position = "initial";
                boxSlides.style.display = "flex";
                boxSlides.style.justifyContent = "space-around";
                for (let slide of slidesArray) {
                    slide.style.position = "initial";
                    slide.style.display = "inline-block";
                    slide.style.opacity = "1";
                };
            };
            if (slidesArray.length > visibleSlidesCount) {
                // если слайды выходят за рамки контейнера
                // расставляем абсолютным позиционированием относительно контейнера
                boxSlides.setAttribute("data-interval", intervalPositionSlide);
                boxSlides.setAttribute("data-slide-width", widthSlide);
                boxSlides.setAttribute("data-slide-margin", marginSlide);
                for (let slide of slidesArray) {
                    slide.style.left = slidePosition + "\%";
                    slide.setAttribute("data-position", slidePosition);
                    if (slidePosition < 0 || slidePosition > 100) {
                        slide.style.opacity = "0";
                    } else {
                        slide.style.opacity = "1";
                    };
                    slidePosition += intervalPositionSlide;
                    slide.style.display = "inline-block";
                };
            };
        }, 0);
    };
};
/**
 * функция смещения слайдов влево
 */
function moveLeft() {
    let leftArrow = event.target;
    let boxSlides = leftArrow.nextElementSibling;
    let rightArrow = boxSlides.nextElementSibling;
    removeListener(leftArrow, rightArrow);
    let slidesArray = boxSlides.children;
    let intervalPositionSlide = boxSlides.getAttribute("data-interval");
    let lastSlidePosition = 0;
    for (let slide of slidesArray) {
        let slidePosition = slide.getAttribute("data-position");
        let newSlidePosition = slidePosition - intervalPositionSlide;
        if (slidePosition > lastSlidePosition) {
            lastSlidePosition = parseFloat(slidePosition);
        };
        slide.style.opacity = "1";
        slide.style.transition = "all 1s";
        slide.style.left = newSlidePosition + "\%";
        slide.setAttribute("data-position", newSlidePosition);
    };
    setTimeout(function() {
        let firstHideSlide;
        let firstSlidePosition = 0;
        for (let slide of slidesArray) {
            let slidePosition = slide.getAttribute("data-position");
            slide.style.transition = "";
            if (slidePosition < 0 || slidePosition > 100) {
                slide.style.opacity = "0";
            }
            if (firstSlidePosition > slidePosition) {
                firstSlidePosition = parseFloat(slidePosition);
                firstHideSlide = slide;
            }
        };
        firstHideSlide.style.left = lastSlidePosition + "\%";
        firstHideSlide.setAttribute("data-position", lastSlidePosition);
    }, 1000);
    addListener(leftArrow, rightArrow);
};

/**
 * функция смещения слайдов вправо
 */
function moveRight() {
    let rightArrow = event.target;
    let boxSlides = rightArrow.previousElementSibling;
    let leftArrow = boxSlides.previousElementSibling;
    removeListener(leftArrow, rightArrow);
    let slidesArray = boxSlides.children;
    let intervalPositionSlide = parseFloat(boxSlides.getAttribute("data-interval"));
    let marginSlide = boxSlides.getAttribute("data-slide-margin");
    let lastSlide;
    let lastSlidePosition = 0;
    for (let slide of slidesArray) {
        let slidePosition = slide.getAttribute("data-position");
        slide.style.transition = "";
        if (lastSlidePosition < slidePosition) {
            lastSlidePosition = parseFloat(slidePosition);
            lastSlide = slide;
        };
    };
    let firstSlidePosition = 0 - parseFloat(intervalPositionSlide - marginSlide / 2);
    lastSlide.style.display = "none";
    lastSlide.style.opacity = "1";
    lastSlide.style.left = firstSlidePosition + "\%";
    lastSlide.setAttribute("data-position", firstSlidePosition);
    lastSlide.style.display = "inline-block";
    
    for (let slide of slidesArray) {
        let slidePosition = parseFloat(slide.getAttribute("data-position"));
        let newSlidePosition = slidePosition + intervalPositionSlide;
        if (slide !== lastSlide) {
            setTimeout(function(){
                slide.style.opacity = "1";
                slide.style.transition = "all 1s";
                slide.style.left = newSlidePosition + "\%";
                slide.setAttribute("data-position", newSlidePosition);
            }, 0);
        } else {
            setTimeout(function() {
                lastSlide.style.transition = "all 1s";
                lastSlide.style.left = newSlidePosition + "\%";
                lastSlide.setAttribute("data-position", newSlidePosition);
            }, 0);
        };
    };
    addListener(leftArrow, rightArrow);
};

/**
 * Функция убирает слушатели с кнопок упралвения слайдером
 * @param {Node} leftArrow 
 * @param {Node} rightArrow 
 */
function removeListener(leftArrow, rightArrow) {
    leftArrow.removeEventListener('click', moveLeft);
    rightArrow.removeEventListener('click', moveRight);
};

/**
 * Функция добавляет слушатели на кнопки управления слайдером
 * @param {Node} leftArrow 
 * @param {Node} rightArrow 
 */
function addListener(leftArrow, rightArrow) {
    setTimeout(function() {
        leftArrow.addEventListener('click', moveLeft);
        rightArrow.addEventListener('click', moveRight);
    }, 1000);
}


