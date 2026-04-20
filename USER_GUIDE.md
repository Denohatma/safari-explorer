# InvestIQ: Data Centres — User Guide

**Africa Data Centre Intelligence Platform**
Developed by the Africa Climate and Energy Nexus (AfCEN)

---

## Overview

InvestIQ: Data Centres is a web-based intelligence platform that provides comprehensive analytics on Africa's data centre ecosystem. The platform covers 39 tracked investment-grade facilities across 15 countries, sovereign AI compute demand modelling for all 54 African nations, enabling environment assessments, and curated market intelligence.

The platform is organised into five tabs, each serving a distinct analytical purpose.

---

## Tab 1: Data Centre Portfolio

The primary infrastructure view, combining an interactive map with a sortable data table.

### Interactive Map

- **Facility markers** are colour-coded by status:
  - Green: Existing (operational)
  - Blue: Under Construction
  - Orange: Planned
  - Red: Potential
- **Marker size** scales with MW capacity — larger circles represent higher-capacity facilities.
- **Click a marker** to open a detailed popup showing the facility name, operator, city, country, status, tier, WLC score, capacity (MW), CapEx, committed funding, funding gap, and type.
- **Click a marker again** to open the full facility detail modal, which includes a radar chart of the 12-dimension SAFARI scores and a per-dimension breakdown.

### Map Overlays

Two toggleable overlays are available in the top-left control panel:

- **Electricity Grid**: Displays Africa's high-voltage transmission network (amber lines). Source: World Bank / energydata.info.
- **Fibre Network**: Displays terrestrial and submarine fibre optic routes (purple lines). Useful for assessing connectivity prerequisites.

### Data Centre Sharing Links

Dashed blue lines on the map represent proposed data centre sharing connections between countries. These illustrate how the continent could be interconnected through shared DC resources, with hub countries serving smaller neighbours that lack the demand to justify standalone sovereign facilities.

### Status Bar

The bar above the map displays:

- Facility counts and total MW by status (Existing, Under Construction, Planned)
- Total DCs, Total MW, CapEx Needed, Committed funding, and Funding Gap
- Africa market context: share of global capacity, facility count, market value (2024 and 2030 projections), CAGR, Africa AI Fund size, and McKinsey demand growth projections

### Data Table

The bottom panel contains a searchable, sortable table of all 39 facilities with columns for Facility, Country, City, Operator, Status, Type, MW, CapEx ($M), Committed ($M), Gap ($M), WLC score, and Tier. Column filters allow narrowing by any field.

### Key Metrics

| Metric | Value |
|---|---|
| Total facilities tracked | 39 |
| Countries represented | 15 |
| Total IT capacity | 1,675 MW |
| Total CapEx (planned + UC) | $10,868M |
| Total committed | $4,498M |
| Funding gap | $6,370M |

---

## Tab 2: Sovereign DC Pipeline

Models sovereign AI compute demand for all 54 African countries using the SADM (Sovereign AI Demand Model).

### How the Model Works

Demand is estimated using four factors: GDP ($B), a digital maturity factor, internet penetration (%), and population proxy. Sovereign demand is calculated as 35% of total IT load. Capital expenditure is estimated at $10M per MW.

### Country Tiers

| Tier | Criteria | Count |
|---|---|---|
| Tier 1 | >50 MW total demand — independently host sovereign + commercial | 6 |
| Tier 2 | 20–50 MW — independently host, may serve as regional sharing hub | 9 |
| Tier 3 | 10–19 MW — borderline, may host small sovereign DC or share | 9 |
| Tier 4 | <10 MW — should share sovereign compute via nearest hub | 30 |

### Minimum Viable Sovereign (MVS) Threshold

An interactive control lets you adjust the MVS threshold (20, 30, 40, or 50 MW). Countries with sovereign demand below the threshold are classified as needing shared hosting via a regional hub. The default threshold is 20 MW.

### Stat Cards

The top bar shows: Total Sovereign Demand (MW), Countries Assessed, Can Host Individually, Need Shared Hosting, Sovereign DCs needed, Total CapEx, Committed (estimated), Capital Gap, and countries Needing Policy Technical Assistance.

### Data Table

A searchable table of all 54 countries with columns: Rank, Country, Sovereign MW, Total MW, Readiness score, Host Type (Individual/Shared), Sharing Hub, Regional Bloc, AI Strategy (Yes/No), CapEx ($M), Internet %, and Tier. All columns are sortable and filterable.

### Regional Blocs

Countries are grouped into six regional economic communities:
- **EAC** — East African Community
- **ECOWAS** — Economic Community of West African States
- **SADC** — Southern African Development Community
- **ECCAS** — Economic Community of Central African States
- **AMU** — Arab Maghreb Union
- **IGAD** — Intergovernmental Authority on Development

---

## Tab 3: Enabling Environment

Scores all 54 African countries across 11 dimensions of the SAFARI assessment framework, providing a readiness scorecard for data centre investment.

### SAFARI Dimensions

| Code | Dimension |
|---|---|
| D1 | Power & Energy |
| D2 | Connectivity |
| D3 | Land & Site |
| D4 | Climate & Cooling |
| D5 | Regulatory |
| D6 | Market Demand |
| D7 | Workforce |
| D8 | Logistics |
| D9 | Sustainability |
| D10 | Facility Tier |
| D11 | Africa-Specific |

Each dimension is scored 1–5 (1 = very weak, 5 = excellent). Scores are colour-coded: red (1), orange (2), yellow (3), green (4), dark green (5).

### Score Distribution

The header shows how many countries fall into each score bucket (1–5) and the continent-wide average for each dimension.

### Technical Assistance Recommendations

The rightmost column ("TA Support Needed") identifies which dimensions score 2 or below for each country, indicating where technical assistance would have the greatest impact. Countries scoring above 2 across all dimensions are flagged as "Investment-ready — maintain standards."

### Country Policy Profile

Click any row to open a detailed policy profile card for that country, including a radar chart of all dimension scores.

### Choropleth Map

When this tab is active, the map displays a colour-coded choropleth of policy readiness scores across Africa, allowing visual identification of investment-ready corridors.

---

## Tab 4: Market Intelligence

Combines sector market analysis with a curated news feed.

### Sector Market Opportunity (Left Panel)

- **Africa DC Market**: Current market value ($3.49B in 2024), projected value ($6.81B by 2030), and CAGR (11.8%)
- **Demand Growth**: McKinsey projection of 3.5–5.5x growth to 1.5–2.2 GW by 2030
- **Investment Needed**: $10–20B in new investment required; $60B Africa AI Fund
- **Global DC Market**: $243B globally; Africa's share at 0.6%
- **Installed Capacity Bar**: Visual breakdown of Africa's 1,254 MW across Active (360 MW), Under Construction (238 MW), and Pipeline (656 MW)
- **Top Markets Table**: South Africa, Nigeria, Egypt, Kenya, and Ethiopia with facility counts, market values, and growth outlooks
- **Key Growth Drivers**: AI & Cloud Demand, Data Sovereignty, Submarine Cables, Renewable Energy, Hyperscaler Entry, Blended Finance
- **Key Risks**: Power Reliability, Regulatory Fragmentation, Skills Gap, Currency & FX Risk, Concentration Risk

### Sector Events (Left Panel, below)

Lists 8 upcoming and past data centre industry events across Africa, including event name, date, location, type, description, and relevance to the African DC ecosystem. Events link to their official websites.

### News Feed (Right Panel)

A searchable, filterable table of 76 curated news articles covering the African data centre sector. Each article includes date, country, headline (linked to source), category, source publication, and direct link.

**News Categories**: Expansion, Infrastructure, Investment, Partnership, Policy, Sustainability

Filters are available on Category, Country, and Source columns.

---

## Tab 5: Contact Us

A registration-of-interest page for accessing the full InvestIQ platform.

### Features Highlighted

Six capability areas are showcased:
1. **Market Analytics** — Real-time market sizing, supply-demand tracking, and growth forecasts across 38 African markets
2. **Investment Pipeline** — $21B+ tracked CapEx across 34 projects with funding gap analysis
3. **Sovereign AI Strategy** — 54-country sovereign demand model, sharing hub design, and minimum viable sovereign DC planning
4. **Policy & Regulation** — 12-dimension enabling environment scorecard, data protection tracking, and technical assistance roadmaps
5. **Technical Advisory** — SAFARI GIS-MCDA site assessment, WLC scoring, and location prerequisite analysis
6. **Custom Research** — Bespoke market entry studies, operator benchmarking, and due diligence support

### Registration Form

The form collects: Full Name, Email Address, Organisation, Role/Title, Region/Country of Interest (dropdown), Areas of Interest (checkboxes), and an optional message. Submitting opens the user's email client with a pre-filled message addressed to info@afcen.org.

---

## Key Concepts

### WLC Score (Weighted Location Criteria)

A composite score derived from the 12-dimension SAFARI framework, used to rank and compare facility locations. Higher scores indicate more favourable conditions for data centre deployment.

### Funding Gap

The difference between total estimated CapEx required and committed/secured funding. Displayed at both facility level and aggregate level across the portfolio.

### Data Centre Sharing

A model where countries with insufficient sovereign compute demand (<20 MW at the default threshold) share data centre resources through a regional hub, rather than building standalone sovereign facilities. The 12 identified hubs are: Lagos, Johannesburg, Abidjan, Nairobi, Addis Ababa, Dakar, Kinshasa, Kigali, Accra, Tunis, Casablanca, and Mauritius.

---

## Data Sources

### Primary Research & Industry Reports

| Source | Description | Year |
|---|---|---|
| Africa Data Centres Association (ADCA) | 2026 Report on African DC landscape, facility counts, and capacity data | 2026 |
| Wesgro | Overview of Global and African Data Centre Landscape | Feb 2026 |
| McKinsey & Company | Building Data Centers for Africa's Unique Market Dynamics — demand projections, investment estimates, market sizing | Nov 2025 |
| UNEP-CCC | Business Models and Finance AI Data Centres Policy Brief | 2025 |
| Africa Interconnection Report | Cross-border connectivity and interconnection data | 2025 |
| Digital Progress and Trends Report | Digital infrastructure progress metrics | 2025 |

### Multilateral & Governance Data

| Source | Description | Year |
|---|---|---|
| World Bank | GDP ($B) and governance indicators for all 54 African countries | 2024 |
| ITU (International Telecommunication Union) | Internet penetration data by country | 2024 |
| Oxford Insights | Government AI Readiness Index — used for policy readiness scoring | 2024 |
| African Union | Digital Transformation Strategy 2020–2030 | 2020 |
| Smart Africa Alliance | Member country reports on digital infrastructure | Various |

### National Policy Sources

| Source | Description |
|---|---|
| National AI strategies and digital economy policies | Individual country AI/digital strategies used for the "Has AI Strategy" field and policy readiness assessment |
| Data protection legislation | 40+ African data protection laws tracked; 19 Malabo Convention ratifications |

### Geospatial & Infrastructure Data

| Source | Description |
|---|---|
| CARTO / OpenStreetMap | Base map tiles (light cartographic style) |
| World Bank / energydata.info | Africa high-voltage electricity transmission grid (vector tiles) |
| Africa fibre optic network data | Terrestrial and submarine fibre routes (vector tiles) |
| Africa country boundaries | GeoJSON boundaries with ISO 3166-1 alpha-3 codes for choropleth rendering |

### News & Events Sources

The news feed aggregates articles from 30 publications covering the African data centre sector:

African Business, African Energy Chamber, African Union, ADCA / Rising Advisory, AfriTechBizHub, BlackRock, Business Tech Africa, BusinessWire, Capacity Media, Carnegie Endowment, Construction Review Online, DataCentre Dynamics, FurtherAfrica, GlobeNewsWire, Intelligent CIO Africa, IT News Africa, McKinsey & Company, Microsoft News, Morocco World News, Pan African DC Conference, Research and Markets, TechAfrica News, TechCabal, TechCentral, TechCrunch, Techweez, Teraco, US DFC, Ventureburn, Wesgro

### Methodology Notes

- **Sovereign Demand Model (SADM)**: Estimates total DC demand using GDP, digital maturity factor, internet penetration, and population proxy. Sovereign share is 35% of total IT load. CapEx estimated at $10M/MW.
- **SAFARI Framework**: 12-dimension GIS-MCDA (Multi-Criteria Decision Analysis) scorecard assessing site suitability across Power & Energy, Connectivity, Land & Site, Climate & Cooling, Regulatory, Market Demand, Workforce, Logistics, Sustainability, Facility Tier, Africa-Specific factors, and Security.
- **WLC Scoring**: Weighted Location Criteria score aggregating SAFARI dimension scores into a single composite for facility comparison.
- **Tier Classification**: Based on total estimated demand — Tier 1 (>50 MW), Tier 2 (20–50 MW), Tier 3 (10–19 MW), Tier 4 (<10 MW).

---

## Technical Notes

- The platform runs as a single-page application (React + Vite) and can be accessed via any modern web browser.
- Map rendering uses MapLibre GL JS with CARTO raster tiles.
- All data is bundled with the application — no external API calls are required for core functionality (the news live feed endpoint is optional and falls back to static data).
- Africa boundary GeoJSON (1.3 MB) is lazy-loaded after initial page render to keep startup fast.
- Tab components (Sovereign, Enabling, Intelligence, Contact) are code-split and loaded on demand.

---

*Last updated: 20 April 2026*
*Platform: InvestIQ: Data Centres v1.0*
*Publisher: Africa Climate and Energy Nexus (AfCEN)*
*Contact: info@afcen.org | Nairobi, Kenya*
