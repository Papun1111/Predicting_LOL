Think of these notebooks not just as code files, but as **chapters in a research thesis**. They follow a strictly linear dependency: you cannot prove a result if you haven't validated the data, and you cannot explain the model if it hasn't been trained.

### The Execution Pipeline: Order of Operations

Execute these in the numbered order below to maintain the logical integrity of your research:

| Order | Notebook Name | Primary Purpose | Thesis Significance |
| --- | --- | --- | --- |
| **1** | `01_Exploratory_Data_Analysis.ipynb` | Data Validation | Proves the dataset is clean, balanced, and free of bias. |
| **2** | `02_Model_Training_and_Evaluation.ipynb` | Empirical Results | Establishes the "Baseline" (the "truth" your project produces). |
| **3** | `03_Heuristic_Log_Odds_Simulation.ipynb` | Domain Expert Logic | Adds "Human Knowledge" (Bayesian math) to the raw AI logic. |
| **4** | `04_Explainable_AI_SHAP.ipynb` | Model Interpretability | Opens the "Black Box" to prove the AI isn't just guessing. |

---

### Why this structure is essential for your research

#### Chapter 1: Exploratory Data Analysis (EDA)

**Significance:** This is your **Quality Control**. Professors often skip the ML code and look straight at EDA to see if you actually looked at the data.

* **The Narrative:** You are demonstrating that you identified and dropped "leaky" post-match variables (like `towerKills`), ensuring the AI predicts outcomes based on the **Draft** rather than the **Result**. This is a major score-booster for academic integrity.

#### Chapter 2: Model Training & Evaluation

**Significance:** This is your **Empirical Proof**. It compares your Ensemble against base models (Random Forest, XGBoost).

* **The Narrative:** This chapter proves the "Stacking Ensemble" hypothesis. You aren't just using an algorithm because it's popular; you are demonstrating through raw metrics (Accuracy, F1-Score) that the ensemble strategy outperforms individual models.

#### Chapter 3: Log-Odds Heuristic Simulation

**Significance:** This is your **Bayesian Layer**. Pure ML models often fail to account for "rare events" (like a player failing to take a specific spell).

* **The Narrative:** You are demonstrating advanced mathematical implementation by using the Logit transformation:

$$L = \ln\left(\frac{P}{1-P}\right)$$


$$P_{final} = \frac{1}{1 + e^{-(L - \lambda)}}$$



This proves to the panel that your system can handle human-expert logic, not just statistical correlation.

#### Chapter 4: Explainable AI (SHAP)

**Significance:** This is your **"Defense Against the Machine."** It solves the problem of "Why did the AI predict Blue Team wins?"

* **The Narrative:** You are proving that the AI isn't just looking at random noise. By showing the SHAP summary plots, you validate that the model correctly identifies key game-winning factors (e.g., Synergy and Meta-scores). It transforms the AI from a "Black Box" into a transparent decision-support system.

---

### How to use this for your final report

When you submit your project, the execution order creates a seamless narrative arc:

1. **"We analyzed the data"** (Notebook 1).EDA
2. **"We built a high-performance system"** (Notebook 2).train test split
3. **"We integrated expert domain logic"** (Notebook 3).Heuristic logs
4. **"We verified the logic is sound and transparent"** (Notebook 4). SHAP

If you follow this sequence, you are no longer just submitting "code"—you are submitting a documented scientific process.

Would you like me to help you draft the **"Conclusion" or "Summary of Findings"** text for your thesis document, summarizing the results from these four notebooks?