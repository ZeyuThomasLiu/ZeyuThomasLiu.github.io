---
title: "Large-Precision Homomorphic Sign Evaluation using FHEW/TFHE Bootstrapping"
collection: publications
permalink: /publications/paper2FHEWboots
excerpt: 'This paper is about FHEW/TFHE functional bootstrapping.'
date: 2021-10-04
eprint: 'ePrint; In submission to Eurocrypt 2022.'
authors: <ins>Zeyu Liu</ins>, Daniele Micciancio, Yuriy Polyakov
paperurl: 'https://eprint.iacr.org/2021/1337.pdf'
#citation: 'Your Name, You. (2010). &quot;Paper Title Number 2.&quot; <i>Journal 1</i>. 1(2).'
---
Abstract: A comparison of two encrypted numbers is an important operation needed in many machine learning applications, for example, decision tree or neural network inference/training. An efficient instantiation of this operation in the context of fully homomorphic encryption (FHE) can be challenging, especially when a relatively high precision is sought. The conventional FHE way of evaluating the comparison operation, which is based on the sign function evaluation using FHEW/TFHE bootstrapping, can only support very small precision (practically limited to 5 bits or so). For higher precision, the runtime complexity scales linearly with the ciphertext (plaintext) modulus (i.e., exponentially with the modulus bit size). We propose sign function evaluation algorithms that scale logarithmically with the ciphertext (plaintext) modulus, enabling the support of large-precision comparison in practice. Our sign evaluation algorithms are based on an iterative use of homomorphic floor function algorithms, which are also derived in our work. Further, we generalize our procedures for floor function evaluation to arbitrary function evaluation, which can be used to support both small plaintext moduli (directly) and larger plaintext moduli (by using a homomorphic digit decomposition algorithm, also suggested in our work). We implement all these algorithms using the PALISADE lattice cryptography library, introducing several implementation-specific optimizations along the way, and discuss our experimental results.


[Download paper here](https://eprint.iacr.org/2021/1337.pdf)