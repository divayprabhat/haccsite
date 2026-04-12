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

    # ── GDP & OUTPUT ──────────────────────────────────────────────────────────
    "gdp_decrease causes unemployment_increase",
    "gdp_increase causes unemployment_decrease",
    "gdp_decrease leads to tax_revenue_decrease",
    "gdp_increase leads to tax_revenue_increase",
    "gdp_decrease results in government_deficit_increase",
    "gdp_increase results in government_deficit_decrease",
    "gdp_per_capita_decrease causes living_standard_decrease",
    "gdp_per_capita_increase causes living_standard_increase",
    "gdp_growth_slowdown leads to business_expansion_decrease",
    "gdp_growth_acceleration leads to business_expansion_increase",
    "gdp_contraction causes fiscal_pressure_increase",
    "gdp_expansion causes fiscal_pressure_decrease",
    "gdp_volatility_increase leads to investor_uncertainty_increase",
    "gdp_volatility_decrease leads to investor_uncertainty_decrease",

    # ── CONSUMER SPENDING ─────────────────────────────────────────────────────
    "consumer_spending_decrease leads to business_revenue_decrease",
    "consumer_spending_increase leads to business_revenue_increase",
    "consumer_spending_decrease causes retail_employment_decrease",
    "consumer_spending_increase causes retail_employment_increase",
    "consumer_spending_decrease results in inventory_surplus_increase",
    "consumer_spending_increase results in inventory_surplus_decrease",
    "consumer_spending_decrease leads to service_sector_contraction_increase",
    "consumer_spending_increase leads to service_sector_contraction_decrease",
    "consumer_spending_decrease causes corporate_profit_decrease",
    "consumer_spending_increase causes corporate_profit_increase",
    "consumer_confidence_decrease causes consumer_spending_decrease",
    "consumer_confidence_increase causes consumer_spending_increase",
    "consumer_debt_increase causes discretionary_spending_decrease",
    "consumer_debt_decrease causes discretionary_spending_increase",
    "consumer_saving_rate_increase causes consumption_growth_decrease",
    "consumer_saving_rate_decrease causes consumption_growth_increase",

    # ── CREDIT & LENDING ──────────────────────────────────────────────────────
    "credit_availability_decrease results in investment_decrease",
    "credit_availability_increase results in investment_increase",
    "bank_lending_decrease results in small_business_growth_decrease",
    "bank_lending_increase results in small_business_growth_increase",
    "credit_tightening_increase causes startup_formation_decrease",
    "credit_tightening_decrease causes startup_formation_increase",
    "loan_default_rate_increase causes bank_balance_sheet_deterioration_increase",
    "loan_default_rate_decrease causes bank_balance_sheet_deterioration_decrease",
    "credit_spread_increase causes borrowing_cost_increase",
    "credit_spread_decrease causes borrowing_cost_decrease",
    "interbank_lending_freeze_increase causes financial_system_stress_increase",
    "interbank_lending_freeze_decrease causes financial_system_stress_decrease",
    "mortgage_approval_rate_decrease causes housing_market_activity_decrease",
    "mortgage_approval_rate_increase causes housing_market_activity_increase",
    "subprime_lending_increase causes systemic_risk_increase",
    "subprime_lending_decrease causes systemic_risk_decrease",
    "credit_rating_downgrade causes bond_yield_increase",
    "credit_rating_upgrade causes bond_yield_decrease",

    # ── INFLATION ─────────────────────────────────────────────────────────────
    "inflation_increase causes purchasing_power_decrease",
    "inflation_decrease causes purchasing_power_increase",
    "inflation_increase leads to real_wage_decrease",
    "inflation_decrease leads to real_wage_increase",
    "inflation_increase causes interest_rate_increase",
    "inflation_decrease causes interest_rate_decrease",
    "inflation_uncertainty_increase leads to business_planning_difficulty_increase",
    "inflation_uncertainty_decrease leads to business_planning_difficulty_decrease",
    "hyperinflation_increase causes currency_value_decrease",
    "hyperinflation_decrease causes currency_value_increase",
    "core_inflation_increase leads to central_bank_tightening_increase",
    "core_inflation_decrease leads to central_bank_tightening_decrease",
    "wage_inflation_increase causes production_cost_increase",
    "wage_inflation_decrease causes production_cost_decrease",
    "energy_price_inflation_increase causes transportation_cost_increase",
    "energy_price_inflation_decrease causes transportation_cost_decrease",
    "food_price_inflation_increase causes household_budget_stress_increase",
    "food_price_inflation_decrease causes household_budget_stress_decrease",
    "asset_price_inflation_increase causes wealth_inequality_increase",
    "asset_price_inflation_decrease causes wealth_inequality_decrease",

    # ── INTEREST RATES ────────────────────────────────────────────────────────
    "interest_rate_increase leads to mortgage_default_increase",
    "interest_rate_decrease leads to mortgage_default_decrease",
    "interest_rate_increase causes housing_affordability_decrease",
    "interest_rate_decrease causes housing_affordability_increase",
    "interest_rate_increase leads to business_investment_decrease",
    "interest_rate_decrease leads to business_investment_increase",
    "interest_rate_increase causes car_loan_affordability_decrease",
    "interest_rate_decrease causes car_loan_affordability_increase",
    "interest_rate_increase leads to bond_price_decrease",
    "interest_rate_decrease leads to bond_price_increase",
    "interest_rate_increase causes currency_appreciation_increase",
    "interest_rate_decrease causes currency_appreciation_decrease",
    "low_interest_rate_environment_increase causes asset_bubble_risk_increase",
    "low_interest_rate_environment_decrease causes asset_bubble_risk_decrease",
    "interest_rate_increase leads to savings_return_increase",
    "interest_rate_decrease leads to savings_return_decrease",
    "negative_interest_rate_increase causes bank_profitability_decrease",
    "negative_interest_rate_decrease causes bank_profitability_increase",

    # ── UNEMPLOYMENT ──────────────────────────────────────────────────────────
    "unemployment_increase causes consumer_spending_decrease",
    "unemployment_decrease causes consumer_spending_increase",
    "unemployment_increase leads to government_welfare_expenditure_increase",
    "unemployment_decrease leads to government_welfare_expenditure_decrease",
    "unemployment_increase causes tax_base_decrease",
    "unemployment_decrease causes tax_base_increase",
    "long_term_unemployment_increase causes skill_atrophy_increase",
    "long_term_unemployment_decrease causes skill_atrophy_decrease",
    "youth_unemployment_increase causes social_instability_risk_increase",
    "youth_unemployment_decrease causes social_instability_risk_decrease",
    "structural_unemployment_increase causes productivity_growth_decrease",
    "structural_unemployment_decrease causes productivity_growth_increase",
    "unemployment_benefit_exhaustion_increase causes poverty_rate_increase",
    "unemployment_benefit_exhaustion_decrease causes poverty_rate_decrease",
    "mass_layoff_event_increase causes local_economic_activity_decrease",
    "mass_layoff_event_decrease causes local_economic_activity_increase",
    "unemployment_rate_increase causes mental_health_burden_increase",
    "unemployment_rate_decrease causes mental_health_burden_decrease",

    # ── STOCK MARKET ──────────────────────────────────────────────────────────
    "stock_market_decrease causes consumer_confidence_decrease",
    "stock_market_increase causes consumer_confidence_increase",
    "stock_market_decrease leads to pension_fund_value_decrease",
    "stock_market_increase leads to pension_fund_value_increase",
    "stock_market_crash_increase causes credit_contraction_increase",
    "stock_market_crash_decrease causes credit_contraction_decrease",
    "equity_market_volatility_increase causes investment_risk_aversion_increase",
    "equity_market_volatility_decrease causes investment_risk_aversion_decrease",
    "stock_market_decrease causes household_net_worth_decrease",
    "stock_market_increase causes household_net_worth_increase",
    "stock_market_decrease leads to ipo_activity_decrease",
    "stock_market_increase leads to ipo_activity_increase",
    "margin_call_frequency_increase causes forced_selling_increase",
    "margin_call_frequency_decrease causes forced_selling_decrease",
    "stock_market_decrease causes corporate_fundraising_difficulty_increase",
    "stock_market_increase causes corporate_fundraising_difficulty_decrease",

    # ── BUSINESS & INVESTMENT ─────────────────────────────────────────────────
    "business_revenue_decrease causes employment_levels_decrease",
    "business_revenue_increase causes employment_levels_increase",
    "business_investment_decrease leads to productivity_growth_decrease",
    "business_investment_increase leads to productivity_growth_increase",
    "business_failure_rate_increase causes job_destruction_increase",
    "business_failure_rate_decrease causes job_destruction_decrease",
    "capital_expenditure_decrease leads to long_term_capacity_decrease",
    "capital_expenditure_increase leads to long_term_capacity_increase",
    "profit_margin_decrease causes dividend_payment_decrease",
    "profit_margin_increase causes dividend_payment_increase",
    "corporate_debt_increase causes financial_fragility_increase",
    "corporate_debt_decrease causes financial_fragility_decrease",
    "merger_activity_decrease causes market_consolidation_decrease",
    "merger_activity_increase causes market_consolidation_increase",
    "business_confidence_decrease causes hiring_freeze_increase",
    "business_confidence_increase causes hiring_freeze_decrease",
    "r_and_d_spending_decrease leads to innovation_rate_decrease",
    "r_and_d_spending_increase leads to innovation_rate_increase",
    "foreign_direct_investment_decrease leads to capital_formation_decrease",
    "foreign_direct_investment_increase leads to capital_formation_increase",

    # ── MANUFACTURING & TRADE ─────────────────────────────────────────────────
    "manufacturing_output_decrease leads to export_revenue_decrease",
    "manufacturing_output_increase leads to export_revenue_increase",
    "manufacturing_output_decrease causes industrial_employment_decrease",
    "manufacturing_output_increase causes industrial_employment_increase",
    "trade_deficit_increase causes currency_depreciation_risk_increase",
    "trade_deficit_decrease causes currency_depreciation_risk_decrease",
    "export_demand_decrease causes factory_utilization_decrease",
    "export_demand_increase causes factory_utilization_increase",
    "supply_chain_disruption_increase causes production_cost_increase",
    "supply_chain_disruption_decrease causes production_cost_decrease",
    "tariff_increase causes import_cost_increase",
    "tariff_decrease causes import_cost_decrease",
    "import_cost_increase causes domestic_price_level_increase",
    "import_cost_decrease causes domestic_price_level_decrease",
    "trade_war_intensity_increase causes global_trade_volume_decrease",
    "trade_war_intensity_decrease causes global_trade_volume_increase",
    "export_competitiveness_decrease causes trade_surplus_decrease",
    "export_competitiveness_increase causes trade_surplus_increase",
    "manufacturing_capacity_utilization_decrease leads to capital_investment_decrease",
    "manufacturing_capacity_utilization_increase leads to capital_investment_increase",

    # ── GOVERNMENT & FISCAL POLICY ────────────────────────────────────────────
    "government_spending_decrease leads to public_service_quality_decrease",
    "government_spending_increase leads to public_service_quality_increase",
    "fiscal_stimulus_increase causes aggregate_demand_increase",
    "fiscal_stimulus_decrease causes aggregate_demand_decrease",
    "government_debt_increase causes sovereign_risk_premium_increase",
    "government_debt_decrease causes sovereign_risk_premium_decrease",
    "tax_revenue_decrease causes budget_deficit_increase",
    "tax_revenue_increase causes budget_deficit_decrease",
    "austerity_measure_increase causes public_investment_decrease",
    "austerity_measure_decrease causes public_investment_increase",
    "automatic_stabilizer_activation_increase causes recession_depth_decrease",
    "automatic_stabilizer_activation_decrease causes recession_depth_increase",
    "infrastructure_spending_increase leads to long_run_productivity_increase",
    "infrastructure_spending_decrease leads to long_run_productivity_decrease",
    "social_safety_net_spending_increase causes poverty_severity_decrease",
    "social_safety_net_spending_decrease causes poverty_severity_increase",
    "corporate_tax_rate_increase causes after_tax_profit_decrease",
    "corporate_tax_rate_decrease causes after_tax_profit_increase",
    "income_tax_increase causes disposable_income_decrease",
    "income_tax_decrease causes disposable_income_increase",

    # ── MONETARY POLICY ───────────────────────────────────────────────────────
    "central_bank_rate_increase causes loan_growth_decrease",
    "central_bank_rate_decrease causes loan_growth_increase",
    "quantitative_easing_increase causes asset_price_increase",
    "quantitative_easing_decrease causes asset_price_decrease",
    "money_supply_increase leads to inflation_risk_increase",
    "money_supply_decrease leads to inflation_risk_decrease",
    "reserve_requirement_increase causes bank_lending_capacity_decrease",
    "reserve_requirement_decrease causes bank_lending_capacity_increase",
    "forward_guidance_clarity_increase causes market_uncertainty_decrease",
    "forward_guidance_clarity_decrease causes market_uncertainty_increase",
    "central_bank_credibility_increase causes inflation_expectation_stability_increase",
    "central_bank_credibility_decrease causes inflation_expectation_stability_decrease",
    "yield_curve_inversion_increase causes recession_probability_increase",
    "yield_curve_inversion_decrease causes recession_probability_decrease",

    # ── HOUSING MARKET ────────────────────────────────────────────────────────
    "housing_price_decrease causes household_wealth_decrease",
    "housing_price_increase causes household_wealth_increase",
    "housing_price_decrease leads to construction_activity_decrease",
    "housing_price_increase leads to construction_activity_increase",
    "foreclosure_rate_increase causes neighborhood_property_value_decrease",
    "foreclosure_rate_decrease causes neighborhood_property_value_increase",
    "housing_starts_decrease causes construction_employment_decrease",
    "housing_starts_increase causes construction_employment_increase",
    "home_equity_decrease causes home_equity_loan_availability_decrease",
    "home_equity_increase causes home_equity_loan_availability_increase",
    "rental_vacancy_rate_increase causes rental_income_decrease",
    "rental_vacancy_rate_decrease causes rental_income_increase",
    "housing_supply_shortage_increase causes affordability_decrease",
    "housing_supply_shortage_decrease causes affordability_increase",
    "real_estate_speculation_increase causes price_bubble_risk_increase",
    "real_estate_speculation_decrease causes price_bubble_risk_decrease",

    # ── BANKING & FINANCIAL SYSTEM ────────────────────────────────────────────
    "bank_capital_ratio_decrease causes systemic_fragility_increase",
    "bank_capital_ratio_increase causes systemic_fragility_decrease",
    "non_performing_loan_ratio_increase causes bank_profitability_decrease",
    "non_performing_loan_ratio_decrease causes bank_profitability_increase",
    "bank_run_probability_increase causes financial_panic_increase",
    "bank_run_probability_decrease causes financial_panic_decrease",
    "shadow_banking_growth_increase causes regulatory_oversight_gap_increase",
    "shadow_banking_growth_decrease causes regulatory_oversight_gap_decrease",
    "financial_leverage_increase causes asset_price_volatility_increase",
    "financial_leverage_decrease causes asset_price_volatility_decrease",
    "deposit_guarantee_coverage_increase causes bank_run_risk_decrease",
    "deposit_guarantee_coverage_decrease causes bank_run_risk_increase",
    "banking_sector_concentration_increase causes systemic_risk_increase",
    "banking_sector_concentration_decrease causes systemic_risk_decrease",
    "financial_regulation_strength_increase causes risk_taking_decrease",
    "financial_regulation_strength_decrease causes risk_taking_increase",

    # ── CURRENCY & EXCHANGE RATES ─────────────────────────────────────────────
    "currency_depreciation_increase causes import_cost_increase",
    "currency_depreciation_decrease causes import_cost_decrease",
    "currency_depreciation_increase leads to export_price_competitiveness_increase",
    "currency_depreciation_decrease leads to export_price_competitiveness_decrease",
    "exchange_rate_volatility_increase causes trade_uncertainty_increase",
    "exchange_rate_volatility_decrease causes trade_uncertainty_decrease",
    "capital_flight_increase causes currency_depreciation_increase",
    "capital_flight_decrease causes currency_depreciation_decrease",
    "foreign_exchange_reserve_decrease causes currency_defense_capacity_decrease",
    "foreign_exchange_reserve_increase causes currency_defense_capacity_increase",
    "current_account_deficit_increase causes external_borrowing_need_increase",
    "current_account_deficit_decrease causes external_borrowing_need_decrease",

    # ── LABOR MARKET ──────────────────────────────────────────────────────────
    "wage_growth_increase causes household_income_increase",
    "wage_growth_decrease causes household_income_decrease",
    "labor_force_participation_decrease causes potential_output_decrease",
    "labor_force_participation_increase causes potential_output_increase",
    "minimum_wage_increase causes low_income_purchasing_power_increase",
    "minimum_wage_decrease causes low_income_purchasing_power_decrease",
    "gig_economy_growth_increase causes worker_income_stability_decrease",
    "gig_economy_growth_decrease causes worker_income_stability_increase",
    "labor_productivity_increase causes unit_labor_cost_decrease",
    "labor_productivity_decrease causes unit_labor_cost_increase",
    "skills_mismatch_increase causes structural_unemployment_increase",
    "skills_mismatch_decrease causes structural_unemployment_decrease",
    "union_bargaining_power_increase causes wage_share_of_gdp_increase",
    "union_bargaining_power_decrease causes wage_share_of_gdp_decrease",
    "automation_adoption_increase causes routine_job_displacement_increase",
    "automation_adoption_decrease causes routine_job_displacement_decrease",
    "worker_retraining_investment_increase causes structural_unemployment_decrease",
    "worker_retraining_investment_decrease causes structural_unemployment_increase",

    # ── INEQUALITY & POVERTY ──────────────────────────────────────────────────
    "income_inequality_increase causes social_mobility_decrease",
    "income_inequality_decrease causes social_mobility_increase",
    "poverty_rate_increase causes healthcare_cost_burden_increase",
    "poverty_rate_decrease causes healthcare_cost_burden_decrease",
    "wealth_concentration_increase causes political_influence_inequality_increase",
    "wealth_concentration_decrease causes political_influence_inequality_decrease",
    "wage_stagnation_increase causes household_debt_increase",
    "wage_stagnation_decrease causes household_debt_decrease",
    "educational_inequality_increase causes intergenerational_poverty_increase",
    "educational_inequality_decrease causes intergenerational_poverty_decrease",
    "social_safety_net_adequacy_decrease causes poverty_trap_intensity_increase",
    "social_safety_net_adequacy_increase causes poverty_trap_intensity_decrease",

    # ── GLOBAL & CONTAGION EFFECTS ────────────────────────────────────────────
    "global_recession_depth_increase causes emerging_market_stress_increase",
    "global_recession_depth_decrease causes emerging_market_stress_decrease",
    "financial_contagion_spread_increase causes cross_border_credit_contraction_increase",
    "financial_contagion_spread_decrease causes cross_border_credit_contraction_decrease",
    "commodity_price_collapse_increase causes resource_exporter_gdp_decrease",
    "commodity_price_collapse_decrease causes resource_exporter_gdp_increase",
    "global_trade_volume_decrease causes port_activity_decrease",
    "global_trade_volume_increase causes port_activity_increase",
    "geopolitical_risk_increase causes foreign_investment_decrease",
    "geopolitical_risk_decrease causes foreign_investment_increase",
    "global_supply_chain_fragility_increase causes inflation_pass_through_increase",
    "global_supply_chain_fragility_decrease causes inflation_pass_through_decrease",
    "developed_economy_recession_increase causes export_demand_for_developing_countries_decrease",
    "developed_economy_recession_decrease causes export_demand_for_developing_countries_increase",

    # ── CONFIDENCE & EXPECTATIONS ─────────────────────────────────────────────
    "business_confidence_decrease causes capital_expenditure_decrease",
    "business_confidence_increase causes capital_expenditure_increase",
    "inflation_expectation_increase causes wage_demand_increase",
    "inflation_expectation_decrease causes wage_demand_decrease",
    "recession_expectation_increase causes precautionary_saving_increase",
    "recession_expectation_decrease causes precautionary_saving_decrease",
    "policy_uncertainty_increase causes investment_delay_increase",
    "policy_uncertainty_decrease causes investment_delay_decrease",
    "market_sentiment_deterioration_increase causes risk_asset_selloff_increase",
    "market_sentiment_deterioration_decrease causes risk_asset_selloff_decrease",
    "economic_optimism_increase causes forward_investment_commitment_increase",
    "economic_optimism_decrease causes forward_investment_commitment_decrease",

    # ── PRODUCTIVITY & GROWTH ─────────────────────────────────────────────────
    "total_factor_productivity_decrease causes potential_gdp_growth_decrease",
    "total_factor_productivity_increase causes potential_gdp_growth_increase",
    "technology_adoption_rate_increase causes output_per_worker_increase",
    "technology_adoption_rate_decrease causes output_per_worker_decrease",
    "human_capital_investment_increase causes long_run_earnings_increase",
    "human_capital_investment_decrease causes long_run_earnings_decrease",
    "regulatory_burden_increase causes compliance_cost_increase",
    "regulatory_burden_decrease causes compliance_cost_decrease",
    "competition_intensity_increase causes price_markup_decrease",
    "competition_intensity_decrease causes price_markup_increase",
    "infrastructure_quality_decrease causes logistics_cost_increase",
    "infrastructure_quality_increase causes logistics_cost_decrease",
    "energy_cost_increase causes industrial_production_cost_increase",
    "energy_cost_decrease causes industrial_production_cost_decrease",

    # ── REAL ESTATE & CONSTRUCTION ────────────────────────────────────────────
    "commercial_real_estate_vacancy_increase causes rental_income_decrease",
    "commercial_real_estate_vacancy_decrease causes rental_income_increase",
    "construction_cost_increase causes new_housing_supply_decrease",
    "construction_cost_decrease causes new_housing_supply_increase",
    "property_tax_revenue_decrease causes municipal_service_quality_decrease",
    "property_tax_revenue_increase causes municipal_service_quality_increase",
    "real_estate_price_crash_increase causes bank_collateral_value_decrease",
    "real_estate_price_crash_decrease causes bank_collateral_value_increase",

    # ── ENERGY & COMMODITIES ──────────────────────────────────────────────────
    "oil_price_increase causes transportation_cost_increase",
    "oil_price_decrease causes transportation_cost_decrease",
    "oil_price_increase leads to energy_import_bill_increase",
    "oil_price_decrease leads to energy_import_bill_decrease",
    "commodity_price_increase causes raw_material_cost_increase",
    "commodity_price_decrease causes raw_material_cost_decrease",
    "energy_price_volatility_increase causes business_planning_uncertainty_increase",
    "energy_price_volatility_decrease causes business_planning_uncertainty_decrease",
    "renewable_energy_cost_decrease causes fossil_fuel_dependency_decrease",
    "renewable_energy_cost_increase causes fossil_fuel_dependency_increase",

    # ── DEBT & LEVERAGE ───────────────────────────────────────────────────────
    "household_debt_to_income_ratio_increase causes financial_vulnerability_increase",
    "household_debt_to_income_ratio_decrease causes financial_vulnerability_decrease",
    "sovereign_debt_crisis_increase causes government_borrowing_cost_increase",
    "sovereign_debt_crisis_decrease causes government_borrowing_cost_decrease",
    "debt_deleveraging_increase causes asset_price_decrease",
    "debt_deleveraging_decrease causes asset_price_increase",
    "debt_monetization_increase causes inflation_expectation_increase",
    "debt_monetization_decrease causes inflation_expectation_decrease",
    "corporate_leverage_increase causes earnings_volatility_increase",
    "corporate_leverage_decrease causes earnings_volatility_decrease",
    "student_debt_burden_increase causes household_formation_rate_decrease",
    "student_debt_burden_decrease causes household_formation_rate_increase",

    # ── BANKING FEEDBACK LOOPS ────────────────────────────────────────────────
    "bank_lending_decrease causes gdp_growth_decrease",
    "bank_lending_increase causes gdp_growth_increase",
    "credit_crunch_severity_increase causes small_business_closure_rate_increase",
    "credit_crunch_severity_decrease causes small_business_closure_rate_decrease",
    "loan_loss_provision_increase causes bank_profit_decrease",
    "loan_loss_provision_decrease causes bank_profit_increase",
    "bank_profit_decrease causes dividend_cut_increase",
    "bank_profit_increase causes dividend_cut_decrease",
    "interbank_rate_increase causes lending_rate_increase",
    "interbank_rate_decrease causes lending_rate_decrease",
    "liquidity_trap_severity_increase causes monetary_policy_effectiveness_decrease",
    "liquidity_trap_severity_decrease causes monetary_policy_effectiveness_increase",

    # ── RECESSION SPIRAL CHAINS ───────────────────────────────────────────────
    "gdp_decrease causes business_revenue_decrease",
    "business_revenue_decrease causes layoff_rate_increase",
    "layoff_rate_increase causes household_income_decrease",
    "household_income_decrease causes consumer_spending_decrease",
    "consumer_spending_decrease causes gdp_decrease",
    "gdp_increase causes business_revenue_increase",
    "business_revenue_increase causes hiring_rate_increase",
    "hiring_rate_increase causes household_income_increase",
    "household_income_increase causes consumer_spending_increase",
    "consumer_spending_increase causes gdp_increase",

    # ── RECOVERY DYNAMICS ─────────────────────────────────────────────────────
    "monetary_easing_increase causes borrowing_cost_decrease",
    "borrowing_cost_decrease causes investment_activity_increase",
    "investment_activity_increase causes employment_growth_increase",
    "employment_growth_increase causes wage_growth_increase",
    "wage_growth_increase causes consumer_confidence_increase",
    "fiscal_expansion_increase causes aggregate_demand_increase",
    "aggregate_demand_increase causes output_gap_decrease",
    "output_gap_decrease causes unemployment_rate_decrease",
    "unemployment_rate_decrease causes wage_pressure_increase",
    "wage_pressure_increase causes inflation_increase",

    # ── FINANCIAL CRISIS DYNAMICS ─────────────────────────────────────────────
    "asset_price_bubble_increase causes systemic_leverage_increase",
    "asset_price_bubble_decrease causes systemic_leverage_decrease",
    "systemic_leverage_increase causes crash_severity_increase",
    "systemic_leverage_decrease causes crash_severity_decrease",
    "crash_severity_increase causes credit_freeze_increase",
    "crash_severity_decrease causes credit_freeze_decrease",
    "credit_freeze_increase causes real_economy_damage_increase",
    "credit_freeze_decrease causes real_economy_damage_decrease",
    "bank_bailout_cost_increase causes public_debt_increase",
    "bank_bailout_cost_decrease causes public_debt_decrease",
    "financial_crisis_severity_increase causes long_run_gdp_loss_increase",
    "financial_crisis_severity_decrease causes long_run_gdp_loss_decrease",
    "post_crisis_deleveraging_increase causes credit_growth_slowdown_increase",
    "post_crisis_deleveraging_decrease causes credit_growth_slowdown_decrease",

    # ── STRUCTURAL ECONOMIC FACTORS ───────────────────────────────────────────
    "demographic_aging_increase causes pension_expenditure_increase",
    "demographic_aging_decrease causes pension_expenditure_decrease",
    "demographic_aging_increase causes labor_supply_decrease",
    "demographic_aging_decrease causes labor_supply_increase",
    "urbanization_rate_increase causes agglomeration_productivity_increase",
    "urbanization_rate_decrease causes agglomeration_productivity_decrease",
    "institutional_quality_increase causes transaction_cost_decrease",
    "institutional_quality_decrease causes transaction_cost_increase",
    "property_rights_security_increase causes long_term_investment_increase",
    "property_rights_security_decrease causes long_term_investment_decrease",
    "rule_of_law_strength_increase causes contract_enforcement_reliability_increase",
    "rule_of_law_strength_decrease causes contract_enforcement_reliability_decrease",

    # ── SECTORAL SPILLOVERS ───────────────────────────────────────────────────
    "automotive_sector_contraction_increase causes steel_demand_decrease",
    "automotive_sector_contraction_decrease causes steel_demand_increase",
    "technology_sector_downturn_increase causes venture_capital_activity_decrease",
    "technology_sector_downturn_decrease causes venture_capital_activity_increase",
    "retail_closure_rate_increase causes commercial_rent_income_decrease",
    "retail_closure_rate_decrease causes commercial_rent_income_increase",
    "airline_sector_stress_increase causes tourism_revenue_decrease",
    "airline_sector_stress_decrease causes tourism_revenue_increase",
    "agriculture_productivity_decrease causes food_import_dependency_increase",
    "agriculture_productivity_increase causes food_import_dependency_decrease",

    # ── INTERNATIONAL CAPITAL FLOWS ───────────────────────────────────────────
    "capital_inflow_increase causes domestic_investment_capacity_increase",
    "capital_inflow_decrease causes domestic_investment_capacity_decrease",
    "capital_outflow_increase causes domestic_credit_availability_decrease",
    "capital_outflow_decrease causes domestic_credit_availability_increase",
    "hot_money_inflow_increase causes currency_overvaluation_risk_increase",
    "hot_money_inflow_decrease causes currency_overvaluation_risk_decrease",
    "remittance_inflow_increase causes household_consumption_increase",
    "remittance_inflow_decrease causes household_consumption_decrease",
    "sovereign_wealth_fund_withdrawal_increase causes domestic_asset_support_decrease",
    "sovereign_wealth_fund_withdrawal_decrease causes domestic_asset_support_increase",
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
