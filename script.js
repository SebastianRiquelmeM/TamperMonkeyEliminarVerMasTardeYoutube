// ==UserScript==
// @name         Limpieza de Lista "Ver Más Tarde" de YouTube con Botones Animados
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Elimina automáticamente los videos de la lista "Ver Más Tarde" de YouTube con botones animados
// @author       You
// @match        https://www.youtube.com/playlist?list=WL*
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	var intervalId;

	function removeVideo() {
		var video = document.querySelector("ytd-playlist-video-renderer");
		if (!video) return;

		var actionMenuButton = video.querySelector("#menu #button");
		if (actionMenuButton) {
			actionMenuButton.click();
		}

		setTimeout(function () {
			var removeButton = Array.from(
				document.querySelectorAll("ytd-menu-service-item-renderer")
			).find((el) => el.innerText.includes("Eliminar de Ver más tarde"));

			if (removeButton) {
				removeButton.click();
			}
		}, 500);
	}

	function applyBootstrapStyle(button, color, hoverColor) {
		button.style.padding = "10px 15px";
		button.style.fontSize = "14px";
		button.style.lineHeight = "1.5";
		button.style.borderRadius = "0.25rem";
		button.style.border = "1px solid transparent";
		button.style.color = "white";
		button.style.backgroundColor = color;
		button.style.transition =
			"color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out, transform .2s";
		button.onmouseover = function () {
			this.style.backgroundColor = hoverColor;
			this.style.transform = "scale(1.05)";
		};
		button.onmouseout = function () {
			this.style.backgroundColor = color;
			this.style.transform = "scale(1)";
		};
	}

	function createButtons() {
		var scrollContainer = document.getElementById("scroll-container");
		if (!scrollContainer) return;

		var startButton = document.createElement("button");
		startButton.textContent = "🗑️ Comenzar a eliminar todos los videos";
		startButton.style.cursor = "pointer";
		startButton.style.marginRight = "10px";
		applyBootstrapStyle(startButton, "#28a745", "#218838"); // Verde con hover más oscuro
		startButton.addEventListener("click", function () {
			intervalId = setInterval(removeVideo, 1000);
			startButton.disabled = true;
		});

		var stopButton = document.createElement("button");
		stopButton.textContent = "🛑 Detener Eliminación";
		stopButton.style.cursor = "pointer";
		applyBootstrapStyle(stopButton, "#dc3545", "#c82333"); // Rojo con hover más oscuro
		stopButton.addEventListener("click", function () {
			clearInterval(intervalId);
			startButton.disabled = false;
		});

		scrollContainer.appendChild(startButton);
		scrollContainer.appendChild(stopButton);
	}

	// Retrasa la creación de los botones para asegurarse de que el contenedor ha cargado
	setTimeout(createButtons, 3000);
})();
