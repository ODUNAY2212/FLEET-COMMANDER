document.addEventListener("DOMContentLoaded", () => {
  const vehicleForm = document.getElementById("vehicle-form");
  const modelInput = document.getElementById("vehicle-model");
  const odometerInput = document.getElementById("vehicle-odemeter");
  const statusSelect = document.getElementById("vehicle-status");
  const activeContainer = document.getElementById("fleet-container-1");
  const maintenanceContainer = document.getElementById("fleet-container-2");
  const standbyContainer = document.getElementById("fleet-container-3");
  const totalDistanceElement = document.getElementById("total-distance");
  const purgeButton = document.getElementById("btn-2");

  const fleet = [];
  const STATUS = {
    ACTIVE: "Active",
    MAINTENANCE: "Maintenance",
    STANDBY: "Standby",
  };

  function formatDistance(value) {
    return `${value.toLocaleString()} km`;
  }

  function updateTotalDistance() {
    const total = fleet.reduce((sum, vehicle) => sum + vehicle.odometer, 0);
    totalDistanceElement.textContent = formatDistance(total);
  }

  function getDestination(vehicle) {
    if (vehicle.status === STATUS.MAINTENANCE) {
      return maintenanceContainer;
    }
    if (vehicle.status === STATUS.STANDBY) {
      return standbyContainer;
    }
    return activeContainer;
  }

  function createVehicleCard(vehicle) {
    const card = document.createElement("div");
    card.className = "fleet-card";
    card.dataset.id = vehicle.id;

    const title = document.createElement("h4");
    title.textContent = vehicle.model;

    const info = document.createElement("p");
    info.textContent = `Mileage: ${vehicle.odometer.toLocaleString()} km`;

    const status = document.createElement("p");
    status.textContent = `Status: ${vehicle.status}`;
    status.className =
      vehicle.status === STATUS.MAINTENANCE
        ? "status-text maintenance"
        : "status-text";

    const actions = document.createElement("div");
    actions.className = "fleet-actions";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeVehicle(vehicle.id));

    actions.appendChild(removeButton);
    card.append(title, info, status, actions);
    return card;
  }

  function renderFleet() {
    activeContainer.innerHTML = "";
    maintenanceContainer.innerHTML = "";
    standbyContainer.innerHTML = "";

    fleet.forEach((vehicle) => {
      const card = createVehicleCard(vehicle);
      getDestination(vehicle).appendChild(card);
    });

    updateTotalDistance();
  }

  function resetForm() {
    vehicleForm.reset();
    statusSelect.value = STATUS.ACTIVE;
    modelInput.focus();
  }

  function validateInputs(model, odometerValue) {
    if (!model) {
      window.alert("Please enter a vehicle model.");
      modelInput.focus();
      return false;
    }

    if (
      !odometerInput.value ||
      Number.isNaN(odometerValue) ||
      odometerValue < 0
    ) {
      window.alert("Please enter a valid mileage value.");
      odometerInput.focus();
      return false;
    }

    return true;
  }

  function addVehicle(event) {
    event.preventDefault();

    const model = modelInput.value.trim();
    const odometerValue = Number(odometerInput.value);
    const status = statusSelect.value || STATUS.ACTIVE;

    if (!validateInputs(model, odometerValue)) {
      return;
    }

    const vehicle = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      model,
      odometer: odometerValue,
      status,
    };

    fleet.push(vehicle);
    renderFleet();
    resetForm();
  }

  function removeVehicle(id) {
    const index = fleet.findIndex((vehicle) => vehicle.id === id);
    if (index !== -1) {
      fleet.splice(index, 1);
      renderFleet();
    }
  }

  function purgeMaintenance() {
    const maintenanceVehicles = fleet.filter(
      (vehicle) => vehicle.status === STATUS.MAINTENANCE,
    );

    if (maintenanceVehicles.length === 0) {
      window.alert("No vehicles under maintenance to purge.");
      return;
    }

    if (!window.confirm("Purge all vehicles currently under maintenance?")) {
      return;
    }

    const remainingVehicles = fleet.filter(
      (vehicle) => vehicle.status !== STATUS.MAINTENANCE,
    );
    fleet.length = 0;
    fleet.push(...remainingVehicles);
    renderFleet();
  }

  vehicleForm.addEventListener("submit", addVehicle);
  purgeButton.addEventListener("click", purgeMaintenance);
});
