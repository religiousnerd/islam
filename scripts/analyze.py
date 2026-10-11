#!/usr/bin/env python3
"""Experimental, clearly labeled evidence-index calculation.

The outcome describes the *coded sample of traditions*, never Muhammad's
personality, moral worth, mental state or historical frequency of behavior.
Only reviewed claims with documented editorial-consensus judgments are admitted.
Multiple claims in the same event cluster never count as extra events.
"""
from __future__ import annotations

from collections import defaultdict
from random import Random

MODEL_VERSION = 'exploratory-cluster-v1'
MIN_EVENT_CLUSTERS = 5  # Conservative publication policy, not a scientific cutoff.


def calculate(rows: list[dict], *, draws: int = 1200, seed: int = 632) -> dict:
    """Return descriptive point estimate and a model sensitivity range.

    Each row: event_cluster_id, direction[-3,3], plausibility_low/high[0,1],
    interpretability[0,1]. Inputs are editorial assessments, not measured odds.
    The 10th–90th percentile range samples plausible review weights; it is NOT
    a confidence or credible interval and ignores sampling/selection bias.
    """
    clusters = defaultdict(list)
    for row in rows:
        d = row['direction']
        low, high, interp = (row[k] for k in ('plausibility_low','plausibility_high','interpretability'))
        if not (-3 <= d <= 3 and 0 <= low <= high <= 1 and 0 <= interp <= 1):
            raise ValueError('Out-of-range quantitative review')
        clusters[row['event_cluster_id']].append((d/3,low,high,interp))
    if len(clusters) < MIN_EVENT_CLUSTERS:
        return {'status':'insufficient_data','independent_event_clusters':len(clusters),
                'minimum_for_display':MIN_EVENT_CLUSTERS,'estimate':None,
                'scenario_p10':None,'scenario_p90':None}

    def metric(randomise: bool, rng: Random | None=None):
        numerator = denominator = 0.0
        for members in clusters.values():
            row_weights=[(rng.uniform(lo,hi) if randomise else (lo+hi)/2)*interp
                         for _,lo,hi,interp in members]
            cluster_w=sum(row_weights)/len(row_weights)
            if not cluster_w:
                continue
            cluster_value=sum(w * x for (x,_,_,_),w in zip(members,row_weights))/sum(row_weights)
            numerator += cluster_w * cluster_value
            denominator += cluster_w
        return numerator/denominator if denominator else None

    mid = metric(False)
    if mid is None:
        return {'status':'insufficient_weight','independent_event_clusters':len(clusters),
                'minimum_for_display':MIN_EVENT_CLUSTERS,'estimate':None,
                'scenario_p10':None,'scenario_p90':None}
    rng=Random(seed)
    scenarios=sorted(value for _ in range(draws) if (value:=metric(True,rng)) is not None)
    return {'status':'exploratory','independent_event_clusters':len(clusters),
            'minimum_for_display':MIN_EVENT_CLUSTERS,
            'estimate':round(mid,4),
            'scenario_p10':round(scenarios[int((len(scenarios)-1)*0.10)],4) if scenarios else None,
            'scenario_p90':round(scenarios[int((len(scenarios)-1)*0.90)],4) if scenarios else None,
            'interpretation':'Signed, evidence-weighted index of the coded sample (-1 to +1); not a personality rating.',
            'uncertainty':'Sensitivity to plausible reviewer weights only; 10–90% simulation quantiles are NOT statistical confidence bounds.',
            'model':MODEL_VERSION}
