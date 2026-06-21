document.addEventListener("DOMContentLoaded", () => {
  const vehicleForm = document.getElementById("vehicle-form");
  const modelInput = document.getElementById("vehicle-model");
  const odometerInput = document.getElementById("vehicle-odemeter");
  const statusSelect = document.getElementById("vehicle-status");
  const purgeButton = document.getElementById("btn-2");
  const activeContainer = document.getElementById("fleet-container-1");
  const maintenanceContainer = document.getElementById("fleet-container-2");
  const standbyContainer = document.getElementById("fleet-container-3");
  const totalDistanceElement = document.getElementById("total-distance");

  const fleet = [];
  const STATUS = {
    ACTIVE: "Active",
    MAINTENANCE: "Maintenance",
    STANDBY: "Standby",
  };

  function getSelectedStatus() {
    return statusSelect.value || STATUS.ACTIVE;
  }

  function formatDistance(value) {
    return `${value.toLocaleString()} km`;
  }

  function updateTotalDistance() {
    const total = fleet.reduce((sum, vehicle) => sum + vehicle.odometer, 0);
    totalDistanceElement.textContent = formatDistance(total);
  }

  function createVehicleCard(vehicle) {
    const card = document.createElement("div");
    card.className = "fleet-card";
    card.dataset.id = vehicle.id;

    const title = document.createElement("h4");
    title.textContent = vehicle.model;

    const odometer = document.createElement("p");
    odometer.textContent = `Mileage: ${vehicle.odometer.toLocaleString()} km`;

    const status = document.createElement("p");
    status.textContent = `Status: ${vehicle.status}`;
    status.className = `status-text${vehicle.status === STATUS.MAINTENANCE ? " maintenance" : ""}`;

    const actions = document.createElement("div");
    actions.className = "fleet-actions";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeVehicle(vehicle.id));

    actions.appendChild(removeButton);
    card.append(title, odometer, status, actions);
    return card; 
  }

  function renderFleet() {
    activeContainer.innerHTML = "";
    maintenanceContainer.innerHTML = "";
    standbyContainer.innerHTML = "";

    fleet.forEach((vehicle) => {
      const card = createVehicleCard(vehicle);
      const destination =
        vehicle.status === STATUS.MAINTENANCE
          ? maintenanceContainer
          : vehicle.status === STATUS.STANDBY
            ? standbyContainer
            : activeContainer;
      destination.appendChild(card);
    });

    updateTotalDistance();
  }

  function resetForm() {
    vehicleForm.reset();
    statusSelect.value = STATUS.ACTIVE;
    modelInput.focus();
  }

  function addVehicle(event) {
    event.preventDefault();

    const model = modelInput.value.trim();
    const odometerValue = Number(odometerInput.value);
    const status = getSelectedStatus();

    if (!model) {
      window.alert("Please enter a vehicle model.");
      modelInput.focus();
      return;
    }

    if (
      !odometerInput.value ||
      Number.isNaN(odometerValue) ||
      odometerValue < 0
    ) {
      window.alert("Please enter a valid mileage value.");
      odometerInput.focus();
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

    const activeVehicles = fleet.filter(
      (vehicle) => vehicle.status !== STATUS.MAINTENANCE,
    );
    fleet.length = 0;
    fleet.push(...activeVehicles);
    renderFleet();
  }

  vehicleForm.addEventListener("submit", addVehicle);
  purgeButton.addEventListener("click", purgeMaintenance);
});
