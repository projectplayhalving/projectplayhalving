export type PlayHalving = {
  "version": "0.1.0",
  "name": "play_halving",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bettingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "settings",
          "type": {
            "defined": "ProgramSettings"
          }
        }
      ]
    },
    {
      "name": "buyTickets",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bettingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userStateAcc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "numTickets",
          "type": "u8"
        }
      ]
    },
    {
      "name": "placeBet",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "secondStateAcc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userStateAcc",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "timestampToBet",
          "type": "i64"
        }
      ]
    },
    {
      "name": "pauseBetting",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bettingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userStateAcc",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bettingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "markHalving",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "secondStateAcc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "halvingTimestamp",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "secondsBetsState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "users",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "userBetsState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "hasReclaimed",
            "type": "bool"
          },
          {
            "name": "totalPaidTickets",
            "type": "u64"
          },
          {
            "name": "availablePaidTickets",
            "type": "u64"
          },
          {
            "name": "availableFreeTickets",
            "type": "u64"
          },
          {
            "name": "totalPlacedTickets",
            "type": "u64"
          },
          {
            "name": "placedBetSeconds",
            "type": {
              "vec": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "programConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTimestamp",
            "type": "i64"
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "bettingMint",
            "type": "publicKey"
          },
          {
            "name": "programVault",
            "type": "publicKey"
          },
          {
            "name": "status",
            "type": {
              "defined": "ProgramStatus"
            }
          },
          {
            "name": "settings",
            "type": {
              "defined": "ProgramSettings"
            }
          },
          {
            "name": "totalBetsPlaced",
            "type": "u64"
          },
          {
            "name": "totalTicketsSold",
            "type": "u64"
          },
          {
            "name": "programConfigBump",
            "type": "u8"
          },
          {
            "name": "winners",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "winnersPaid",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "MarkedHalving",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "halvingTimestamp",
            "type": "i64"
          },
          {
            "name": "markedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "ProgramSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "betFee",
            "type": "u64"
          },
          {
            "name": "grandRewardsPool",
            "type": "u64"
          },
          {
            "name": "minTicketsSold",
            "type": "u64"
          },
          {
            "name": "hourReturnPc",
            "type": "u8"
          },
          {
            "name": "minuteReturnPc",
            "type": "u8"
          },
          {
            "name": "betsFreeBundle",
            "type": "u8"
          },
          {
            "name": "paidBetsForFreeBundle",
            "type": "u8"
          },
          {
            "name": "claimWindowHours",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "ClaimResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Winner"
          },
          {
            "name": "Rebate"
          },
          {
            "name": "Return"
          }
        ]
      }
    },
    {
      "name": "ProgramStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Running"
          },
          {
            "name": "BettingPaused"
          },
          {
            "name": "ClaimsOpen",
            "fields": [
              {
                "defined": "MarkedHalving"
              }
            ]
          },
          {
            "name": "Closed",
            "fields": [
              {
                "defined": "MarkedHalving"
              }
            ]
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "BuyTicketsEvent",
      "fields": [
        {
          "name": "numTickets",
          "type": "u8",
          "index": false
        },
        {
          "name": "numFreeTickets",
          "type": "u8",
          "index": false
        },
        {
          "name": "totalPaidTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "availablePaidTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "availableFreeTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalPlacedTickets",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimEvent",
      "fields": [
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "reclaimResult",
          "type": {
            "defined": "ClaimResult"
          },
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "PlaceBetEvent",
      "fields": [
        {
          "name": "timestampToBet",
          "type": "i64",
          "index": false
        },
        {
          "name": "eventTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "buyer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "totalPaidTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "availablePaidTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "availableFreeTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalPlacedTickets",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SecondOverPurchased",
      "msg": "This second has been fully booked, try another bet."
    },
    {
      "code": 6001,
      "name": "UserOverPurchased",
      "msg": "This user account has been fully booked, try with another wallet."
    },
    {
      "code": 6002,
      "name": "NoTicketsLeft",
      "msg": "No tickets left, buy some more"
    },
    {
      "code": 6003,
      "name": "NotEnoughTokens",
      "msg": "Not enough tokens for purchase"
    },
    {
      "code": 6004,
      "name": "IllegalAdminAccess",
      "msg": "Not an admin!"
    },
    {
      "code": 6005,
      "name": "BettingPaused",
      "msg": "Betting paused!"
    },
    {
      "code": 6006,
      "name": "NotDone",
      "msg": "Betting is not done!"
    },
    {
      "code": 6007,
      "name": "AlreadyClaimed",
      "msg": "User has already reclaimed!"
    },
    {
      "code": 6008,
      "name": "ClaimingWindowClosed",
      "msg": "Claiming window has been closed!"
    },
    {
      "code": 6009,
      "name": "ClaimingWindowIsStillOpen",
      "msg": "Claiming is still open!"
    },
    {
      "code": 6010,
      "name": "IllegalProgramStatus",
      "msg": "Illegal Program Status"
    }
  ]
};

export const IDL: PlayHalving = {
  "version": "0.1.0",
  "name": "play_halving",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bettingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "settings",
          "type": {
            "defined": "ProgramSettings"
          }
        }
      ]
    },
    {
      "name": "buyTickets",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bettingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userStateAcc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "numTickets",
          "type": "u8"
        }
      ]
    },
    {
      "name": "placeBet",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "secondStateAcc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userStateAcc",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "timestampToBet",
          "type": "i64"
        }
      ]
    },
    {
      "name": "pauseBetting",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bettingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userStateAcc",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bettingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "markHalving",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "secondStateAcc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "halvingTimestamp",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "secondsBetsState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "users",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "userBetsState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "hasReclaimed",
            "type": "bool"
          },
          {
            "name": "totalPaidTickets",
            "type": "u64"
          },
          {
            "name": "availablePaidTickets",
            "type": "u64"
          },
          {
            "name": "availableFreeTickets",
            "type": "u64"
          },
          {
            "name": "totalPlacedTickets",
            "type": "u64"
          },
          {
            "name": "placedBetSeconds",
            "type": {
              "vec": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "programConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTimestamp",
            "type": "i64"
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "bettingMint",
            "type": "publicKey"
          },
          {
            "name": "programVault",
            "type": "publicKey"
          },
          {
            "name": "status",
            "type": {
              "defined": "ProgramStatus"
            }
          },
          {
            "name": "settings",
            "type": {
              "defined": "ProgramSettings"
            }
          },
          {
            "name": "totalBetsPlaced",
            "type": "u64"
          },
          {
            "name": "totalTicketsSold",
            "type": "u64"
          },
          {
            "name": "programConfigBump",
            "type": "u8"
          },
          {
            "name": "winners",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "winnersPaid",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "MarkedHalving",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "halvingTimestamp",
            "type": "i64"
          },
          {
            "name": "markedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "ProgramSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "betFee",
            "type": "u64"
          },
          {
            "name": "grandRewardsPool",
            "type": "u64"
          },
          {
            "name": "minTicketsSold",
            "type": "u64"
          },
          {
            "name": "hourReturnPc",
            "type": "u8"
          },
          {
            "name": "minuteReturnPc",
            "type": "u8"
          },
          {
            "name": "betsFreeBundle",
            "type": "u8"
          },
          {
            "name": "paidBetsForFreeBundle",
            "type": "u8"
          },
          {
            "name": "claimWindowHours",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "ClaimResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Winner"
          },
          {
            "name": "Rebate"
          },
          {
            "name": "Return"
          }
        ]
      }
    },
    {
      "name": "ProgramStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Running"
          },
          {
            "name": "BettingPaused"
          },
          {
            "name": "ClaimsOpen",
            "fields": [
              {
                "defined": "MarkedHalving"
              }
            ]
          },
          {
            "name": "Closed",
            "fields": [
              {
                "defined": "MarkedHalving"
              }
            ]
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "BuyTicketsEvent",
      "fields": [
        {
          "name": "numTickets",
          "type": "u8",
          "index": false
        },
        {
          "name": "numFreeTickets",
          "type": "u8",
          "index": false
        },
        {
          "name": "totalPaidTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "availablePaidTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "availableFreeTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalPlacedTickets",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimEvent",
      "fields": [
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "reclaimResult",
          "type": {
            "defined": "ClaimResult"
          },
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "PlaceBetEvent",
      "fields": [
        {
          "name": "timestampToBet",
          "type": "i64",
          "index": false
        },
        {
          "name": "eventTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "buyer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "totalPaidTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "availablePaidTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "availableFreeTickets",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalPlacedTickets",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SecondOverPurchased",
      "msg": "This second has been fully booked, try another bet."
    },
    {
      "code": 6001,
      "name": "UserOverPurchased",
      "msg": "This user account has been fully booked, try with another wallet."
    },
    {
      "code": 6002,
      "name": "NoTicketsLeft",
      "msg": "No tickets left, buy some more"
    },
    {
      "code": 6003,
      "name": "NotEnoughTokens",
      "msg": "Not enough tokens for purchase"
    },
    {
      "code": 6004,
      "name": "IllegalAdminAccess",
      "msg": "Not an admin!"
    },
    {
      "code": 6005,
      "name": "BettingPaused",
      "msg": "Betting paused!"
    },
    {
      "code": 6006,
      "name": "NotDone",
      "msg": "Betting is not done!"
    },
    {
      "code": 6007,
      "name": "AlreadyClaimed",
      "msg": "User has already reclaimed!"
    },
    {
      "code": 6008,
      "name": "ClaimingWindowClosed",
      "msg": "Claiming window has been closed!"
    },
    {
      "code": 6009,
      "name": "ClaimingWindowIsStillOpen",
      "msg": "Claiming is still open!"
    },
    {
      "code": 6010,
      "name": "IllegalProgramStatus",
      "msg": "Illegal Program Status"
    }
  ]
};
