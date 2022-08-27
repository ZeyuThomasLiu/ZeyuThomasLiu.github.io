---
title: "OpenFHE: Open-Source Fully Homomorphic Encryption Library"
collection: publications
permalink: /publications/paper1OpenFHE
excerpt: 'Fully Homomorphic Encryption (FHE) is a powerful cryptographic primitive that enables performing computations over encrypted data without having access to the secret key. We introduce OpenFHE, a new open-source FHE software library that incorporates selected design ideas from prior FHE projects, such as PALISADE, HElib, and HEAAN, and includes several new design concepts and ideas. '
date: 2022-07-15
venue: 'WAHC 2022.'
authors: Ahmad Al Badawi, Jack Bates, Flavio Bergamaschi, David Bruce Cousins, Saroja Erabelli, Nicholas Genise, Shai Halevi, Hamish Hunt, Andrey Kim, Yongwoo Lee, Zeyu Liu, Daniele Micciancio, Ian Quah, Yuriy Polyakov, Saraswathy R.V., Kurt Rohloff, Jonathan Saylor, Dmitriy Suponitsky, Matthew Triplett, Vinod Vaikuntanathan, and Vincent Zucca
paperurl: 'https://eprint.iacr.org/2022/915.pdf'
#citation: ''

---
Fully Homomorphic Encryption (FHE) is a powerful cryptographic primitive that enables performing computations over encrypted data without having access to the secret key. We introduce OpenFHE, a new open-source FHE software library that incorporates selected design ideas from prior FHE projects, such as PALISADE, HElib, and HEAAN, and includes several new design concepts and ideas. The main new design features can be summarized as follows: (1) we assume from the very beginning that all implemented FHE schemes will support bootstrapping and scheme switching; (2) OpenFHE supports multiple hardware acceleration backends using a standard Hardware Abstraction Layer (HAL); (3) OpenFHE includes both user-friendly modes, where all maintenance operations, such as modulus switching, key switching, and bootstrapping, are automatically invoked by the library, and compiler-friendly modes, where an external compiler makes these decisions. This paper focuses on high-level description of OpenFHE design, and the reader is pointed to external OpenFHE references for a more detailed/technical description of the software library.

[Download paper here](https://eprint.iacr.org/2022/915.pdf)