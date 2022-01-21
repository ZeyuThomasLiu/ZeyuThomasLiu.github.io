---
title: "Synthesizing Diverse and Physically Stable Grasps with Arbitrary Hand Structures using Differentiable Force Closure Estimator"
collection: publications
permalink: /publications/paper1grasp
excerpt: 'This paper is about synthesizing diverse and physically stable grasps via force closure.'
date: 2021-04-19
venue: 'IEEE Robotics and Automation Letters (RA-L) Special Issue: Robotic Grasping and Manipulation Challenges and Progress'
authors: Tengyu Liu, <ins>Zeyu Liu</ins>, Ziyuan Jiao, Yixin Zhu, Song-Chun Zhu
paperurl: 'https://arxiv.org/pdf/2104.09194.pdf'
#citation: 'Your Name, You. (2015). &quot;Paper Title Number 3.&quot; <i>Journal 1</i>. 1(3).'
---
Existing grasp synthesis methods are either analytical or data-driven. The former one is oftentimes limited to specific application scope. The latter one depends heavily on demonstrations, thus suffers from generalization issues; \eg, models trained with human grasp data would be difficult to transfer to 3-finger grippers. To tackle these deficiencies, we formulate a fast and differentiable force closure estimation method, capable of producing diverse and physically stable grasps with arbitrary hand structures, without any training data. Although force closure has commonly served as a measure of grasp quality, it has not been widely adopted as an optimization objective for grasp synthesis primarily due to its high computational complexity; in comparison, the proposed differentiable method can test a force closure within milliseconds. In experiments, we validate the proposed method's efficacy in 6 different settings.

[Download paper here](https://arxiv.org/pdf/2104.09194.pdf)