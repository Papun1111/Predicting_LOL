COMPETITIVE INTELLIGENCE AI: LEAGUE OF LEGENDS MATCH PREDICTOR & DRAFT ASSISTANT
Final Year Project (FYP) Documentation

======================================================

1. WHAT THIS PROJECT ACTUALLY DOES
======================================================
This project is an advanced, full-stack Artificial Intelligence dashboard designed to predict match outcomes, guide player drafts, and display deep analytics for League of Legends.

Users can interact with multiple core modules via a dynamic web interface:

1. The Match Predictor & X-Ray Dashboard: Users draft 10 champions and select Summoner Spells. The AI outputs a highly accurate Win Probability and a SHAP-powered "X-Ray" chart explaining exactly WHY a team is winning.
2. AI Draft Recommendation System: An interactive drafting assistant (or "mini-game") that suggests the optimal champion picks for a user based on the current team synergy and enemy counter-picks.
3. Champion Dashboard & Combat Logs: A comprehensive database view of all heroes, alongside a history page that saves past predictions so users can review their drafting mistakes and AI feedback over time.
4. Dynamic Tier List: A ranking system that evaluates the current "Meta" strength of all champions.
5. Academic Research Tab: A dedicated analytics page displaying the model's backend performance, including Accuracy metrics, ROC (Receiver Operating Characteristic) curves, and distribution graphs.

# ======================================================
2. WHY WE ARE DOING THIS (THE OBJECTIVE)

Most video game prediction models suffer from the "Black Box" problem—they output a win percentage but cannot explain the logic behind it, nor can they actively guide a user to make better choices. Furthermore, standard Machine Learning models only look at raw data and often miss crucial "human strategy" elements.

The objective of this Final Year Project is to build a "Hybrid Intelligent Architecture" that solves these flaws. We aim to prove that combining standard Data Mining with an Expert Heuristic System (human rules) and Explainable AI creates a transparent, academically rigorous tool. By including a Recommendation System and a Research Tab, we bridge the gap between a simple calculator and a fully interactive, mathematically validated competitive assistant.

# ======================================================
3. HOW WE ARE DOING IT (THE METHODOLOGY)

We achieve this through a Multi-Stage AI and Analytics Engine:

Step 1: The Machine Learning Base & Evaluation
We use a Stacking Ensemble model (XGBoost + Random Forest) to process millions of data points to calculate Team Synergy, Counter-Picks, Meta Strength, and Damage balance. Its validity is constantly monitored and displayed in the Research Tab via ROC curves and accuracy checks.

Step 2: The Expert Strategy Layer (Bayesian Update)
We convert the base ML probability into Log-Odds (Logits). If a team makes a severe strategic error (such as playing without the "Smite" spell), the system applies a mathematical penalty directly into the log-space, guaranteeing mathematically sound probabilities.

Step 3: Explainable AI (SHAP)
We pass the final data through SHapley Additive exPlanations (SHAP). This calculates the exact weight of every single feature and translates the complex math into readable insights for the user interface.

Step 4: The Recommendation Engine
By iteratively testing available champions against the trained Ensemble Model, the system ranks the highest-yielding additions to a draft, offering real-time, data-driven suggestions to the user.

Step 5: The Full-Stack Loop
The user interacts with a React frontend. The draft, history, and research requests are sent to a Node.js backend, which securely funnels data into the Python engine and logs results in a MongoDB database.

# ======================================================
4. WHAT WE HAVE ACHIEVED UNTIL NOW

To date, the complete end-to-end architecture is 100% operational. We have achieved:

* A fully trained Stacking Classifier achieving stable baseline accuracy, with mathematical proof visually rendered in the live Research Tab via ROC and precision/recall metrics.
* A bulletproof Heuristic Penalty System that successfully punishes bad Summoner Spell drafts using Log-Odds calibration.
* An AI Draft Recommendation system that successfully guides users toward optimal team compositions based on live synergy and counter-pick calculations.
* A responsive React web interface featuring champion pickers, dynamic Tier Lists, and a full Champion Directory.
* A synchronized MongoDB backend that saves every prediction and its SHAP explanations into user "Combat Logs."
* Academic Validation: We engineered a Monte Carlo simulation script that automatically generated 1,000 dynamic test matches, generating professional academic plots to mathematically prove the model's robustness for the final thesis paper.

# ======================================================
5. TECHNOLOGY STACK

Machine Learning & AI Engine:

* Python (Core scripting)
* pandas & numpy (Data manipulation & feature engineering)
* scikit-learn (Data scaling, Random Forest, and ROC/Accuracy metrics)
* XGBoost (Extreme Gradient Boosting for core predictions)
* SHAP (Explainable AI framework for the X-Ray dashboard)
* joblib (Model serialization and loading)

Academic Testing & Visualization:

* matplotlib & seaborn (High-resolution data visualizations for the thesis and Research Tab)
* tqdm (Simulation tracking)

Backend & Database:

* Node.js & Express.js (REST API and Python process management)
* MongoDB & Mongoose (NoSQL database for combat history persistence and hero data)

Frontend User Interface:

* React.js (Component-based UI architecture)
* Tailwind CSS (Utility-first styling for the cyberpunk aesthetic)
* Framer Motion (Fluid animations and UI transitions)
* Recharts (Rendering the dynamic SHAP explanation graphs, ROC curves, and accuracy charts)
* Lucide React (Iconography)