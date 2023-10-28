---
title: "XSPIR: Efficient Symmetrically Private Information Retrieval from Ring-LWE"
collection: publications
permalink: /publications/paper3XSPIR
excerpt: 'Private Information Retrieval (PIR) allows a client to retrieve one entry from a database held by a server, while hiding from the server which entry has been retrieved. Symmetrically Private Information Retrieval (SPIR) additionally protects the privacy of the data, requiring that the client obtains only its desired entry, and no information on other data entries..'
date: 2022-03-30
venue: 'ESORICS 2022.'
authors: Chengyu Lin, <ins>Zeyu Liu</ins>, Tal Malkin
#citation: ''
---
Private Information Retrieval (PIR) allows a client to retrieve one entry from a database held by a server, while hiding from the server which entry has been retrieved. Symmetrically Private Information Retrieval (SPIR) additionally protects the privacy of the data, requiring that the client obtains only its desired entry, and no information on other data entries.

In recent years, considerable effort has been expanded towards making PIR practical, reducing communication and computation. State-of-the-art PIR protocols are based on homomorphic encryption from the ring-LWE assumption. However, these efficient PIR protocols do not achieve database privacy, and leak a lot of information about other data entries, even when the client is honest. Generic transformation of these PIR protocols to SPIR have been suggested, but not implemented.

In this paper, we propose XSPIR, a practically efficient SPIR scheme. Our scheme is based on homomorphic encryption from ring-LWE assumption, like recent PIR works, but achieves a stronger security guarantee with low performance overhead. We implement XSPIR, and run experiments comparing its performance against SealPIR (Angel et. al, IEEE S&P 2018) and MulPIR (Ali et. al, USENIX SECURITY 2021). We find that, even though our scheme achieves a stronger security guarantee, our performance is comparable to these state-of-the-art PIR protocols.