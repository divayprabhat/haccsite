"""
seed_models.py
==============
Run this ONCE to train the three pre-trained models so they are
available in the Vela frontend (PretrainedPage + ChatPage).

Usage:
    # With Ollama running (recommended — cleans bias):
    python seed_models.py

    # Without Ollama (faster, no LLM needed):
    python seed_models.py --no-llm

    # Use a specific Ollama model:
    python seed_models.py --llm-model mistral

After running, your backend will have three persisted models:
  models/seismic_model.json
  models/recession_model.json
  models/tsunami_model.json

These are automatically loaded by the API and appear in GET /models,
the ChatPage model selector, and PretrainedPage.

────────────────────────────────────────────────────────────────────
IMPORTANT: Replace the sample sentences below with YOUR actual data.
           Each line must use explicit causal language:
           "entity_direction causes entity_direction"
           e.g. "tectonic_stress_increase causes seismic_activity_increase"
────────────────────────────────────────────────────────────────────
"""

import argparse
import engine

# ── YOUR TRAINING DATA ────────────────────────────────────────────────────
# Replace these lists with your real formatted sentences.
# Each string must use causal connectors: causes / leads to / results in / triggers

SEISMIC_DATA = [
    # Paste your seismic training sentences here, one per string:
"tectonic_stress_increase causes seismic_activity_increase",
"fault_line_pressure_increase leads to earthquake_risk_increase",
"seismic_activity_increase results in building_damage_increase",
"soil_liquefaction_increase causes infrastructure_damage_increase",
"aftershock_frequency_increase leads to casualty_risk_increase",
"ground_motion_increase causes structural_failure_increase",
"epicenter_depth_decrease leads to surface_damage_increase",
"seismic_wave_amplitude_increase causes ground_displacement_increase",
    "fault_rupture_length_increase results in earthquake_magnitude_increase",
    "building_age_increase causes earthquake_vulnerability_increase",
    "tectonic_stress_increase causes fault_slip_probability_increase",
"fault_slip_probability_increase causes earthquake_occurrence_increase",
"earthquake_occurrence_increase causes ground_shaking_intensity_increase",
"ground_shaking_intensity_increase causes building_damage_increase",
"building_damage_increase causes economic_loss_increase",
"ground_shaking_intensity_increase causes infrastructure_failure_increase",
"infrastructure_failure_increase causes service_disruption_increase",
"service_disruption_increase causes economic_activity_decrease",
"earthquake_occurrence_increase causes landslide_risk_increase",
"landslide_risk_increase causes road_blockage_increase",
"road_blockage_increase causes emergency_response_delay_increase",
"emergency_response_delay_increase causes mortality_rate_increase",
"earthquake_occurrence_increase causes tsunami_risk_increase",
"tsunami_risk_increase causes coastal_flooding_increase",
"coastal_flooding_increase causes property_damage_increase",
"poor_building_codes causes building_vulnerability_increase",
"building_vulnerability_increase causes collapse_risk_increase",
"collapse_risk_increase causes casualty_count_increase",
"population_density_increase causes exposure_risk_increase",
"exposure_risk_increase causes casualty_count_increase",
"early_warning_systems_increase causes evacuation_rate_increase",
"evacuation_rate_increase causes mortality_rate_decrease",
"soil_liquefaction_increase causes foundation_failure_increase",
"foundation_failure_increase causes building_damage_increase",
"aftershock_frequency_increase causes structural_stability_decrease",
"structural_stability_decrease causes collapse_risk_increase",
]

RECESSION_DATA = [
    # Paste your recession/economic training sentences here:
    "gdp_decrease causes unemployment_increase",
    "consumer_spending_decrease leads to business_revenue_decrease",
    "credit_availability_decrease results in investment_decrease",
    "inflation_increase causes purchasing_power_decrease",
    "interest_rate_increase leads to mortgage_default_increase",
    "business_revenue_decrease causes employment_levels_decrease",
    "manufacturing_output_decrease leads to export_revenue_decrease",
    "stock_market_decrease causes consumer_confidence_decrease",
    "bank_lending_decrease results in small_business_growth_decrease",
    "government_spending_decrease leads to public_service_quality_decrease",
    # Add more lines here...
]

TSUNAMI_DATA = [
    # Paste your tsunami training sentences here:
    "undersea_earthquake_increase causes tsunami_risk_increase",
    "ocean_floor_displacement_increase leads to wave_height_increase",
    "wave_height_increase results in coastal_flooding_increase",
    "early_warning_decrease causes evacuation_time_decrease",
    "seabed_landslide_increase leads to tsunami_generation_increase",
    "coastal_elevation_decrease causes inundation_depth_increase",
    "wave_propagation_speed_increase results in warning_time_decrease",
    "submarine_volcano_eruption_increase causes ocean_disturbance_increase",
    "offshore_fault_activity_increase leads to wave_energy_increase",
    "harbor_resonance_increase causes wave_amplification_increase",
    """heavy_rainfall_increase causes river_water_level_rise
river_water_level_rise causes flood_risk_increase
flood_risk_increase causes residential_area_inundation_increase
residential_area_inundation_increase causes property_damage_increase
property_damage_increase causes insurance_claim_increase
insurance_claim_increase causes insurance_premium_increase
heavy_rainfall_increase causes soil_saturation_increase
soil_saturation_increase causes surface_runoff_increase
surface_runoff_increase causes stormwater_volume_increase
stormwater_volume_increase causes drainage_system_overload_increase
drainage_system_overload_increase causes urban_flood_risk_increase
urban_flood_risk_increase causes road_submersion_increase
road_submersion_increase causes traffic_disruption_increase
traffic_disruption_increase causes economic_productivity_decrease
deforestation_increase causes vegetation_cover_decrease
vegetation_cover_decrease causes rainfall_absorption_decrease
rainfall_absorption_decrease causes surface_runoff_increase
glacier_melt_rate_increase causes river_discharge_increase
river_discharge_increase causes downstream_flood_risk_increase
downstream_flood_risk_increase causes agricultural_land_flooding_increase
agricultural_land_flooding_increase causes crop_loss_increase
crop_loss_increase causes food_supply_decrease
food_supply_decrease causes food_price_increase
sea_level_rise causes coastal_flood_frequency_increase
coastal_flood_frequency_increase causes coastal_erosion_increase
coastal_erosion_increase causes land_area_decrease
land_area_decrease causes population_displacement_increase
population_displacement_increase causes refugee_population_increase
refugee_population_increase causes humanitarian_aid_demand_increase
urban_impervious_surface_increase causes stormwater_absorption_decrease
stormwater_absorption_decrease causes surface_runoff_increase
surface_runoff_increase causes flash_flood_risk_increase
flash_flood_risk_increase causes human_casualty_risk_increase
dam_structural_failure_increase causes downstream_flood_surge_increase
downstream_flood_surge_increase causes downstream_community_damage_increase
downstream_community_damage_increase causes economic_loss_increase
economic_loss_increase causes gdp_decrease
snowmelt_rate_increase causes river_flow_increase
river_flow_increase causes floodplain_inundation_increase
floodplain_inundation_increase causes wetland_ecosystem_disruption_increase
wetland_ecosystem_disruption_increase causes biodiversity_loss_increase
flooding_increase causes sewage_system_overflow_increase
sewage_system_overflow_increase causes waterborne_disease_risk_increase
waterborne_disease_risk_increase causes public_health_burden_increase
public_health_burden_increase causes healthcare_expenditure_increase
flooding_increase causes electricity_infrastructure_damage_increase
electricity_infrastructure_damage_increase causes power_outage_increase
power_outage_increase causes industrial_output_decrease
industrial_output_decrease causes employment_decrease
employment_decrease causes household_income_decrease
household_income_decrease causes poverty_rate_increase
flood_event_frequency_increase causes soil_nutrient_loss_increase
soil_nutrient_loss_increase causes agricultural_yield_decrease
agricultural_yield_decrease causes farmer_income_decrease
farmer_income_decrease causes rural_poverty_increase
rural_poverty_increase causes rural_to_urban_migration_increase
rural_to_urban_migration_increase causes urban_population_density_increase
urban_population_density_increase causes urban_flood_vulnerability_increase
levee_maintenance_decrease causes levee_failure_risk_increase
levee_failure_risk_increase causes protected_area_flood_risk_increase
protected_area_flood_risk_increase causes emergency_response_demand_increase
emergency_response_demand_increase causes government_disaster_expenditure_increase
government_disaster_expenditure_increase causes public_debt_increase
climate_temperature_increase causes evaporation_rate_increase
evaporation_rate_increase causes atmospheric_moisture_increase
atmospheric_moisture_increase causes extreme_rainfall_event_frequency_increase
extreme_rainfall_event_frequency_increase causes flood_event_frequency_increase
flood_event_frequency_increase causes disaster_recovery_cost_increase
disaster_recovery_cost_increase causes national_budget_deficit_increase
wetland_area_decrease causes natural_flood_buffer_decrease
natural_flood_buffer_decrease causes downstream_flood_risk_increase
flood_warning_system_improvement causes early_evacuation_rate_increase
early_evacuation_rate_increase causes flood_related_casualty_decrease
flood_related_casualty_decrease causes post_disaster_social_cost_decrease
green_infrastructure_investment_increase causes stormwater_retention_increase
stormwater_retention_increase causes urban_flood_risk_decrease
urban_flood_risk_decrease causes property_value_stability_increase
floodplain_construction_increase causes flood_exposed_population_increase
flood_exposed_population_increase causes flood_disaster_impact_increase
flood_disaster_impact_increase causes post_flood_displacement_increase
post_flood_displacement_increase causes social_instability_increase
social_instability_increase causes economic_investment_decrease
river_channel_sedimentation_increase causes river_water_carrying_capacity_decrease
river_water_carrying_capacity_decrease causes flood_overflow_risk_increase
flood_overflow_risk_increase causes agricultural_damage_increase
agricultural_damage_increase causes food_insecurity_increase
food_insecurity_increase causes malnutrition_rate_increase
malnutrition_rate_increase causes child_mortality_risk_increase"""

]

# ── MODEL DEFINITIONS ─────────────────────────────────────────────────────
MODELS = [
    {
        "model_id":    "seismic_model",
        "data":        SEISMIC_DATA,
        "description": "Seismic Risk — Earthquake Predictor. Trained on fault-line and magnitude data.",
    },
    {
        "model_id":    "recession_model",
        "data":        RECESSION_DATA,
        "description": "Recession Indicator — Economic Risk Analyzer. Trained on macroeconomic indicators.",
    },
    {
        "model_id":    "tsunami_model",
        "data":        TSUNAMI_DATA,
        "description": "Tsunami Warning — Ocean Wave Propagation. Trained on seismic and oceanic data.",
    },
]


# ── MAIN ──────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Seed Vela pre-trained models")
    parser.add_argument("--no-llm",    action="store_true", help="Skip Ollama normalization")
    parser.add_argument("--llm-model", default="llama3.2:1b", help="Ollama model name")
    parser.add_argument("--reset",     action="store_true", help="Wipe existing models before training")
    args = parser.parse_args()

    use_llm = not args.no_llm

    print("╔══════════════════════════════════════════════╗")
    print("║     Vela Model Seeder                        ║")
    print(f"║     LLM normalization: {'ON  (' + args.llm_model + ')' if use_llm else 'OFF'}           ║")
    print("╚══════════════════════════════════════════════╝\n")

    for model_def in MODELS:
        model_id = model_def["model_id"]
        data     = model_def["data"]
        desc     = model_def["description"]

        print(f"▶  Training '{model_id}' ({len(data)} sentences)…")

        if args.reset:
            engine.reset_model(model_id)
            print(f"   ↺  Reset existing model")

        result = engine.train(
            model_id    = model_id,
            texts       = data,
            use_llm     = use_llm,
            llm_model   = args.llm_model,
            description = desc,
        )

        if "error" in result:
            print(f"   ❌ Error: {result['error']}\n")
        elif result.get("warning"):
            print(f"   ⚠️  Warning: {result['warning']}")
            print(f"   Pairs: {result.get('pairs_added', 0)} | Edges: {result.get('total_edges', 0)}\n")
        else:
            print(f"   ✅ pairs_added={result['pairs_added']} | total_edges={result['total_edges']} | vocab={result['vocab_size']}\n")

    print("─" * 48)
    print("All models trained. Verify with:")
    print("  curl http://localhost:8000/models\n")
    print("Models saved to:")
    for m in MODELS:
        print(f"  models/{m['model_id']}.json")


if __name__ == "__main__":
    main()