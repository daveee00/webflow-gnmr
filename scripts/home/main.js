(function () {
  function hideLoadingOverlay() {
    const overlay = document.getElementById("loading-overlay");
    const loadingText = document.querySelector(".loading-text");
    if (loadingText) {
      loadingText.style.opacity = "0";
    }
    setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = "0";
        document.body.classList.add("loaded");
        setTimeout(() => {
          overlay.style.display = "none";
        }, 800);
      }
    }, 300);
  }
  function initWebflowViewer() {
    let camera, scene, renderer;
    let container, clock;
    let lastScrollY = window.scrollY;
    let isScrollingEnabled = false;
    let modelsOriginalPositions = [];
    const loadedModels = [];
    const rotationSpeed = 0.5;
    let loadedModelCount = 0;

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    // MODELS TO LOAD
    const modelsToLoad = [
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/clubDerVisionere.glb",
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/elsewhere.glb",
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/vena.glb",
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/forTheCause.glb",
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/goa.glb",
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/haudio.glb",
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/hor.glb",
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/lesEnfants.glb",
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/theLotRadio.glb",
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/radioPirate.glb",
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/teller.glb",
      "https://cdn.jsdelivr.net/gh/daveee00/export_blender/teknoBirrette.glb",
    ];
    // PAGE LINKS
    const pageLinks = [
      "/performances/club-der-visionaire",
      "/performances/elsewhere",
      "/performances/endovena-festival",
      "/performances/for-the-cause",
      "/performances/goa-last-dance",
      "/performances/haudio",
      "/performances/hor",
      "/performances/les-elephants",
      "/performances/lot-radio",
      "/performances/radio-pirate",
      "/performances/teller",
      "/performances/tekno-birrette",
    ];
    // backgrounds for active page
    const vinylBackground = [
      "linear-gradient(270deg, #EEDC9A, #F5EEC0, #D6BB7D)",
      "linear-gradient(270deg, #5614ca, #8f4dff, #3600a3)",
      "linear-gradient(270deg, #ECE7DC, #ffffff, #dcd4c0)",
      "linear-gradient(270deg, #FE6845, #fcb199, #ff2e00)",
      "linear-gradient(270deg, #5270E5, #88a2ff, #1e3acc)",
      "linear-gradient(270deg, #1e1e1e, #3a3a3a, #0a0a0a)",
      "linear-gradient(270deg, #A6F30D, #d6ff63, #84c900)",
      "linear-gradient(270deg, #FF0101, #ff6b6b, #a10000)",
      "linear-gradient(270deg, #332879, #5942b1, #1a154e)",
      "linear-gradient(270deg, #fed52a, #ffe788, #ffc400)",
      "linear-gradient(270deg, #9223A8, #c758e2, #670078)",
      "linear-gradient(270deg, #0C82A1, #3fc8f2, #00475a)",
    ];

    //titoli-performance 

    const title_performance = [
      "CLUB DER VISIONERE",
      "ELSEWHERE",
      "VENA",
      "FOR THE CAUSE",
      "GOA",
      "HAUDIO",
      "HOR",
      "LES ENFANTS",
      "THE LOT RADIO",
      "RADIO PIRATE",
      "TELLER",
      "TECKNO BIRRETTE",
    ]

    const data_luogo = [
      "00.00.2020, NYC",
      "00.00.2020, Rome",
      "00.00.2020, biringhello",
      "00.00.2020, pantanedo",
      "00.00.2020, parigi",
      "00.00.2020, seoul",
      "00.00.2020, patagonia",
      "00.00.2020, chicago",
      "00.00.2020, bucarets",
      "00.00.2020, monica",
      "00.00.2020, sofia",
      "00.00.2020, giovanna",
    ];


    // Add raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredModel = null;
    let originalModelStates = [];
    let isModelClicked = false;
    function checkAllModelsLoaded() {
      loadedModelCount++;
      if (loadedModelCount === modelsToLoad.length) {
        const loadingText = document.querySelector(".loading-text");
        if (loadingText) {
          loadingText.textContent = "Loading complete!";
        }
        setTimeout(hideLoadingOverlay, 500);
      }

      //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    }
    function loadModels(modelPaths) {
      const loader = new THREE.GLTFLoader();
      modelPaths.forEach((path, index) => {
        loader.load(
          path,
          (gltf) => {
            const model = gltf.scene;
            model.scale.set(10, 10, 10);
            const baseY = -index * 3;
            model.position.set(0, baseY, 0);
            model.userData.baseY = baseY;
            model.userData.offset = index * 0.3;
            model.userData.originalIndex = index;
            model.userData.modelName = `Model ${index + 1} (${path
              .split("/")
              .pop()})`;
            model.rotation.set(
              THREE.MathUtils.degToRad(0),
              THREE.MathUtils.degToRad(180),
              THREE.MathUtils.degToRad(0)
            );
            scene.add(model);
            loadedModels.push(model);
            checkAllModelsLoaded();
          },
          (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            const loadingText = document.querySelector(".loading-text");
            if (loadingText) {
              loadingText.textContent = `Loading... ${Math.round(
                percentComplete
              )}%`;
            }
          },
          (e) => {
            console.error(`Error loading ${path}`, e);
            checkAllModelsLoaded();
          }
        );
      });
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function animate() {
      const time = clock.getElapsedTime();
      const dt = clock.getDelta();
      loadedModels.forEach((model) => {
        if (!isModelClicked) {
          const offset = model.userData.offset || 0;
          model.rotation.y =
            THREE.MathUtils.degToRad(180) +
            THREE.MathUtils.degToRad(15 * Math.sin(time * 1.4 - offset));
        }
      });
      renderer.render(scene, camera);
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function onWindowResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      checkContainerPosition();
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function checkContainerPosition() {
      const rect = container.getBoundingClientRect();
      const stickyWrapper = container.closest(".sticky-wrapper");
      const wrapperRect = stickyWrapper.getBoundingClientRect();
      const isWrapperInView =
        wrapperRect.top <= 0 && wrapperRect.bottom > window.innerHeight;
      const wasEnabled = isScrollingEnabled;
      isScrollingEnabled = isWrapperInView;
      if (!wasEnabled && isScrollingEnabled) {
        console.log("Container in position, scrolling enabled");
        lastScrollY = window.scrollY;
        if (modelsOriginalPositions.length === 0) {
          loadedModels.forEach((model) => {
            modelsOriginalPositions.push({
              model: model,
              y: model.position.y,
            });
          });
        }
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function handleScroll() {
      checkContainerPosition();
      if (isScrollingEnabled) {
        const currentScrollY = window.scrollY;
        const scrollDiff = (currentScrollY - lastScrollY) / 50;
        loadedModels.forEach((model) => {
          model.position.y += scrollDiff;
        });
        lastScrollY = currentScrollY;
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    /*blocco di codice da controllare se funziona*/
    function createActivePage() {
      const stickyWrapper = document.querySelector(".sticky-wrapper");
      const pageActive = document.createElement("div");
      pageActive.id = "page-active";
      pageActive.style.position = "fixed";
      pageActive.style.top = "0";
      pageActive.style.left = "0";
      pageActive.style.width = "100vw";
      pageActive.style.height = "100vh";
      pageActive.style.zIndex = "3";
      pageActive.style.background = "none";
      const closeBtn = document.createElement("button");
      const closeIcon = document.createElement("img");
      closeIcon.src = "https://cdn.jsdelivr.net/gh/daveee00/export_blender/close-button.svg";
      closeIcon.style.width = "24px";
      closeIcon.style.height = "24px";
      closeBtn.appendChild(closeIcon);
      closeBtn.id = "close";
      closeBtn.style.position = "fixed";
      closeBtn.style.top = "0";
      closeBtn.style.left = "0";
      closeBtn.style.background = "none";
      closeBtn.style.border = "none";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.padding = "32px";
      closeBtn.style.opacity = "0.5";
      closeBtn.style.transition = "opacity 300ms ease-out";
      closeBtn.addEventListener("mouseover", () => {
        closeBtn.style.opacity = "1";
      });
      closeBtn.addEventListener("mouseout", () => {
        closeBtn.style.opacity = "0.5";
      });
      pageActive.appendChild(closeBtn);
      stickyWrapper.appendChild(pageActive);
      closeBtn.addEventListener("click", handleClose);
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function storeModelStates() {
      originalModelStates = loadedModels.map((model) => ({
        model: model,
        position: model.position.clone(),
        rotation: model.rotation.clone(),
      }));
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function createNavigationButton(originalIndex) {
      const button = document.createElement("a");
      button.id = "go_to_page_button";
      button.href = pageLinks[originalIndex];
      button.style.position = "fixed";
      button.style.width = "50%";
      button.style.aspectRatio = "1/1";
      button.style.zIndex = "6";
      button.style.left = "50%";
      button.style.top = "50%";
      button.style.transform = "translate(-50%, -50%)";
      button.style.cursor = "none";
      document.body.appendChild(button);
      const tooltip = document.createElement("div");
      tooltip.id = "button-tooltip";
      tooltip.textContent = "discover";
      tooltip.style.position = "fixed";
      tooltip.style.display = "none";
      tooltip.style.padding = "5px 10px";
      tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      tooltip.style.color = "white";
      tooltip.style.borderRadius = "4px";
      tooltip.style.fontSize = "14px";
      tooltip.style.pointerEvents = "none";
      tooltip.style.zIndex = "7";
      document.body.appendChild(tooltip);
      button.addEventListener("mousemove", (e) => {
        tooltip.style.display = "block";
        tooltip.style.left = e.clientX + 10 + "px";
        tooltip.style.top = e.clientY + 10 + "px";
      });
      button.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });
      button.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Button clicked");
        console.log("Target URL:", button.href);
        const activeModel = loadedModels.find(
          (model) =>
            model.position.x === 0 &&
            model.position.y === 0 &&
            model.position.z === 0
        );
        if (activeModel) {
          console.log("Active model found");
          gsap.to(camera.position, {
            z: 0.1,
            duration: 1.5,
            ease: "power2.in",
          });
          gsap.to(activeModel.scale, {
            x: 20,
            y: 20,
            z: 20,
            duration: 1.5,
            ease: "power2.in",
          });
          gsap.to(activeModel.rotation, {
            y: activeModel.rotation.y + THREE.MathUtils.degToRad(360),
            duration: 1.5,
            ease: "power2.in",
          });
          // Remove writing animation before navigation
          const writingContainer = document.getElementById("writing-container");
          if (writingContainer) {
            writingContainer.remove();
          }
          // Add a check to ensure the URL exists before navigating
          const targetUrl = button.href;
          console.log("Checking URL:", targetUrl);
          // Try to navigate directly first
          try {
            console.log("Attempting to navigate to:", targetUrl);
            window.location.href = targetUrl;
          } catch (error) {
            console.error("Navigation error:", error);
            alert(
              "Error navigating to page. Please check the console for details."
            );
          }
        } else {
          console.log("No active model found, attempting direct navigation");
          // Remove writing animation before navigation
          const writingContainer = document.getElementById("writing-container");
          if (writingContainer) {
            writingContainer.remove();
          }
          window.location.href = button.href;
        }
      });
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function removeNavigationButton() {
      const button = document.getElementById("go_to_page_button");
      const tooltip = document.getElementById("button-tooltip");
      if (button) {
        button.remove();
      }
      if (tooltip) {
        tooltip.remove();
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function handleClose() {
      const pageActive = document.getElementById("page-active");
      if (pageActive) {
        pageActive.remove();
      }
      removeNavigationButton();
      removeModelSelectedCanvas();
      isModelClicked = false;

      // Remove background div and its contents
      const backgroundDiv = document.getElementById("model-background");
      if (backgroundDiv) {
        backgroundDiv.remove();
      }

      // Show UI elements
      const uiElements = document.querySelectorAll('.ui-elements');
      uiElements.forEach(element => {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
      });

      // Enable scrolling
      document.body.style.overflow = "auto";

      // Show the main canvas again
      const mainCanvas = document.getElementById("threejs-container");
      if (mainCanvas) {
        mainCanvas.style.display = "block";
      }

      // Remove writing animation
      const writingContainer = document.getElementById("writing-container");
      if (writingContainer) {
        writingContainer.remove();
      }

      originalModelStates.forEach((state) => {
        gsap.to(state.model.position, {
          x: state.position.x,
          y: state.position.y,
          z: state.position.z,
          duration: 1,
          ease: "power2.out",
        });
        gsap.to(state.model.rotation, {
          x: state.rotation.x,
          y: state.rotation.y,
          z: state.rotation.z,
          duration: 1,
          ease: "power2.out",
        });
      });
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function getRandomVideo() {
      const videos = [
        "/videos/pageActive/bda.mp4",
        "/videos/pageActive/swt.mp4",
        "/videos/pageActive/dw.mp4",
        "/videos/pageActive/pos.mp4",
        "/videos/pageActive/mye.mp4",
      ];
      return videos[Math.floor(Math.random() * videos.length)];
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function changeVideoBackground() {
      const videoElement = document.getElementById("video_background");
      if (videoElement) {
        videoElement.src = getRandomVideo();
        videoElement.load();
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function restoreDefaultVideo() {
      const videoElement = document.getElementById("video_background");
      if (videoElement) {
        videoElement.src = "/videos/Liquid Abstract Neon Green 4K.mp4";
        videoElement.load();
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function init() {
      if (!document.getElementById("threejs-container")) {
        container = document.createElement("div");
        container.id = "threejs-container";
        container.style.width = "100%";
        container.style.height = "100vh";
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        container.style.zIndex = "1";
        document.body.appendChild(container);
      } else {
        container = document.getElementById("threejs-container");
      }

      const width = container.clientWidth;
      const height = container.clientHeight;
      camera = new THREE.PerspectiveCamera(35, width / height, 0.25, 200);
      camera.position.set(0, 0, 45);
      camera.lookAt(0, 0, 0);
      scene = new THREE.Scene();
      clock = new THREE.Clock();
      /* const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6); // Reduced intensity
                hemiLight.position.set(10, 30, 10);
                scene.add(hemiLight);*/
      // Add ambient light for better overall illumination
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
      dirLight.position.set(0, 0, 10);
      scene.add(dirLight);

      loadModels(modelsToLoad);
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8;
      renderer.setAnimationLoop(animate);
      container.appendChild(renderer.domElement);
      window.addEventListener("resize", onWindowResize);
      window.addEventListener("scroll", handleScroll);
      renderer.domElement.addEventListener("click", onModelClick);
      window.addEventListener("mousemove", onMouseMove);
      checkContainerPosition();
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function createModelSelectedCanvas(clickedModel) {
      // Remove any existing modelSelected container first
      const existingContainer = document.getElementById("modelSelected");
      if (existingContainer) {
        existingContainer.remove();
      }

      // Log the model name
      console.log("Model loaded in selected canvas:", clickedModel.userData.modelName);

      // Create modelSelected container
      const modelSelected = document.createElement("div");
      modelSelected.id = "modelSelected";
      modelSelected.style.position = "fixed";
      modelSelected.style.top = "0";
      modelSelected.style.left = "0";
      modelSelected.style.width = "100%";
      modelSelected.style.height = "100vh";
      modelSelected.style.zIndex = "5";
      modelSelected.style.overflow = "hidden";
      modelSelected.style.pointerEvents = "none";
      modelSelected.style.display = "flex";
      modelSelected.style.alignItems = "center";
      modelSelected.style.justifyContent = "center";

      // Create canvas for the selected model
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      modelSelected.appendChild(canvas);

      // Create new scene, camera, and renderer for the selected model
      const selectedScene = new THREE.Scene();
      const selectedCamera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.25, 200);
      selectedCamera.position.set(0, 0, 45);
      selectedCamera.lookAt(0, 0, 0);

      // Add lights to the scene
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      selectedScene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
      dirLight.position.set(0, 0, 10);
      selectedScene.add(dirLight);

      // Create new renderer
      const selectedRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
      selectedRenderer.setPixelRatio(window.devicePixelRatio);
      selectedRenderer.setSize(window.innerWidth, window.innerHeight);
      selectedRenderer.outputEncoding = THREE.sRGBEncoding;
      selectedRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      selectedRenderer.toneMappingExposure = 0.8;

      // Load the model again to ensure proper materials and geometries
      const loader = new THREE.GLTFLoader();
      loader.load(
        modelsToLoad[clickedModel.userData.originalIndex],
        (gltf) => {
          const modelClone = gltf.scene;
          modelClone.scale.set(10, 10, 10);
          modelClone.position.set(0, 0, 0);
          
          // Set initial rotation to match the main scene
          modelClone.rotation.set(
            THREE.MathUtils.degToRad(0),
            THREE.MathUtils.degToRad(180),
            THREE.MathUtils.degToRad(0)
          );
          
          selectedScene.add(modelClone);

          // Animation function for the selected model
          function animateSelected() {
            if (document.getElementById("modelSelected")) {
              requestAnimationFrame(animateSelected);
              selectedRenderer.render(selectedScene, selectedCamera);
            }
          }
          animateSelected();

          // Animate to final rotation
          gsap.to(modelClone.rotation, {
            x: THREE.MathUtils.degToRad(0),
            y: THREE.MathUtils.degToRad(90),
            z: THREE.MathUtils.degToRad(90),
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
              // Start continuous rotation after the transition
              function rotateModel() {
                if (document.getElementById("modelSelected")) {
                  requestAnimationFrame(rotateModel);
                  modelClone.rotation.y += 0.01;
                }
              }
              rotateModel();
            }
          });
        },
        undefined,
        (error) => {
          console.error("Error loading model for selected canvas:", error);
        }
      );

      // Handle window resize
      function onSelectedWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        selectedCamera.aspect = width / height;
        selectedCamera.updateProjectionMatrix();
        selectedRenderer.setSize(width, height);
      }
      window.addEventListener("resize", onSelectedWindowResize);

      document.body.appendChild(modelSelected);
    }

    function removeModelSelectedCanvas() {
      const modelSelected = document.getElementById("modelSelected");
      if (modelSelected) {
        modelSelected.remove();
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function onModelClick(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(loadedModels, true);
      if (intersects.length > 0) {
        isModelClicked = true;
        changeVideoBackground();
        let clickedModel = intersects[0].object;
        while (clickedModel.parent && !loadedModels.includes(clickedModel)) {
          clickedModel = clickedModel.parent;
        }
        const clickedIndex = clickedModel.userData.originalIndex;

        // Create background div
        const backgroundDiv = document.createElement("div");
        backgroundDiv.id = "model-background";
        backgroundDiv.style.position = "fixed";
        backgroundDiv.style.top = "0";
        backgroundDiv.style.left = "0";
        backgroundDiv.style.width = "100%";
        backgroundDiv.style.height = "100vh";
        backgroundDiv.style.zIndex = "1";
        //backgroundDiv.style.backgroundColor = "#c1c1c1";
        backgroundDiv.style.display = "flex";
        backgroundDiv.style.flexDirection = "column";
        backgroundDiv.style.justifyContent = "flex-end";
        backgroundDiv.style.alignItems = "left";

        // Create performance specifics div
        const performanceSpecifics = document.createElement("div");
        performanceSpecifics.id = "performance-specifics";
        performanceSpecifics.style.display = "flex";
        performanceSpecifics.style.flexDirection = "column";
        performanceSpecifics.style.margin = "0";
        performanceSpecifics.style.paddingLeft = "32px";
        performanceSpecifics.style.Color = "white";
        performanceSpecifics.style.paddingBottom = "32px";

        // Create title element
        const titleElement = document.createElement("h2");
        titleElement.textContent = title_performance[clickedIndex];
        titleElement.style.color = "white";
        titleElement.style.margin = "0";
        titleElement.style.padding = "0";
        titleElement.style.fontSize = "60px";

        // Create data element
        const dataElement = document.createElement("p");
        dataElement.textContent = data_luogo[clickedIndex];
        dataElement.style.color = "white";
        dataElement.style.margin = "0";
        dataElement.style.padding = "0";
        dataElement.style.fontSize = "32px";

        // Append elements
        performanceSpecifics.appendChild(titleElement);
        performanceSpecifics.appendChild(dataElement);
        backgroundDiv.appendChild(performanceSpecifics);
        document.body.appendChild(backgroundDiv);

        // Hide UI elements
        const uiElements = document.querySelectorAll('.ui-elements');
        uiElements.forEach(element => {
          element.style.opacity = '0';
          element.style.pointerEvents = 'none';
        });

        // Disable scrolling
        document.body.style.overflow = "hidden";

        // Hide the main canvas
        const mainCanvas = document.getElementById("threejs-container");
        if (mainCanvas) {
          mainCanvas.style.display = "none";
        }

        // Create the modelSelected canvas
        createModelSelectedCanvas(clickedModel);

        storeModelStates();
        createActivePage();
        createNavigationButton(clickedIndex);
        gsap.to(clickedModel.position, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: "power2.out",
        });
        gsap.to(clickedModel.rotation, {
          x: THREE.MathUtils.degToRad(0),
          y: THREE.MathUtils.degToRad(90),
          z: THREE.MathUtils.degToRad(90),
          duration: 1,
          ease: "power2.out",
        });
        loadedModels.forEach((model, index) => {
          if (index !== clickedIndex) {
            const yOffset = index < clickedIndex ? 100 : -100;
            gsap.to(model.position, {
              x: 0,
              y: yOffset,
              z: 0,
              duration: 1,
              ease: "power2.out",
            });
          }
        });
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    
    function onMouseMove(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(loadedModels, true);
      if (intersects.length > 0) {
        const newHoveredModel = intersects[0].object.parent;
        if (hoveredModel !== newHoveredModel) {
          if (hoveredModel) {
            gsap.to(hoveredModel.scale, {
              x: 10,
              y: 10,
              z: 10,
              duration: 0.4,
              ease: "power2.out",
            });
          }
          hoveredModel = newHoveredModel;
          gsap.to(hoveredModel.scale, {
            x: 11,
            y: 11,
            z: 11,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      } else if (hoveredModel) {
        gsap.to(hoveredModel.scale, {
          x: 10,
          y: 10,
          z: 10,
          duration: 0.4,
          ease: "power2.out",
        });
        hoveredModel = null;
      }
    }
    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    // Initialize the viewer
    init();
  }
  // Start the viewer when the page loads
  window.addEventListener("load", initWebflowViewer);
})();
