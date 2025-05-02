const fullScreen = (): void => {
  const element = document.documentElement as unknown as Record<
    string,
    () => void
  >;

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    // Safari
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox antigo
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    // IE/Edge antigo
    element.msRequestFullscreen();
  } else {
    console.warn("Fullscreen não suportado neste navegador.");
  }
};

const exitFullScreen = (): void => {
  const element = document as unknown as Record<string, () => void>;
    if (element.exitFullscreen) {
        element.exitFullscreen();
    } else if (element.webkitExitFullscreen) {
        // Safari
        element.webkitExitFullscreen();
    } else if (element.mozCancelFullScreen) {
        // Firefox antigo
        element.mozCancelFullScreen();
    } else if (element.msExitFullscreen) {
        // IE/Edge antigo
        element.msExitFullscreen();
    } else {
        console.warn("Fullscreen não suportado neste navegador.");
    }
}

export { fullScreen, exitFullScreen };
