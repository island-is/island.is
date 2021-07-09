export const area = {
  graphTitle: 'Úthlutun styrkja eftir landshlutum',
  graphDescription: 'Úthlutun styrkja eftir landshlutum ',
  organization: 'Rannís',
  graph: {
    title: 'Úthlutun styrkja eftir landshluta',
    data:
      '[{"name":"HB","Veittir styrkir":655,"Umsóknir":3669},{"name":"Annað","Veittir styrkir":66,"Umsóknir":442},{"name":"RN","Veittir styrkir":18,"Umsóknir":128},{"name":"SL","Veittir styrkir":17,"Umsóknir":115},{"name":"VF","Veittir styrkir":10,"Umsóknir":67},{"name":"AL","Veittir styrkir":7,"Umsóknir":47},{"name":"VL","Veittir styrkir":6,"Umsóknir":35},{"name":"NV","Veittir styrkir":3,"Umsóknir":29}]',
    datakeys:
      '{"xAxis":"name","bars":[{"datakey":"Umsóknir","stackId":"a","color":"#C3ABD9"},{"datakey":"Veittir styrkir","stackId":"a","color":"#6A2EA0"}]}',
    type: 'Bar',
  },
}
export const gender = {
  graphTitle: 'Sótt og veitt eftir kyni',
  graphDescription: 'Umsóknir og veittir styrkir eftir kyni',
  organization: 'Rannís',
  graph: {
    title: 'Sótt og veitt',
    type: 'Mixed',
    data:
      '[{"fund_year":2010,"Karlmaður veittir styrkir":16,"Kona veittir styrkir":6,"Óskilgreint veittir styrkir":1,"Karlmaður umsóknir":88,"Kona umsóknir":16,"Óskilgreint umsóknir":5},{"fund_year":2011,"Karlmaður veittir styrkir":30,"Kona veittir styrkir":15,"Óskilgreint veittir styrkir":1,"Karlmaður umsóknir":169,"Kona umsóknir":48,"Óskilgreint umsóknir":6},{"fund_year":2012,"Karlmaður veittir styrkir":38,"Kona veittir styrkir":14,"Óskilgreint veittir styrkir":1,"Karlmaður umsóknir":144,"Kona umsóknir":41,"Óskilgreint umsóknir":3},{"fund_year":2013,"Karlmaður veittir styrkir":41,"Kona veittir styrkir":19,"Óskilgreint veittir styrkir":1,"Karlmaður umsóknir":237,"Kona umsóknir":86,"Óskilgreint umsóknir":3},{"fund_year":2014,"Karlmaður veittir styrkir":40,"Kona veittir styrkir":16,"Karlmaður umsóknir":175,"Kona umsóknir":57,"Óskilgreint umsóknir":2},{"fund_year":2015,"Karlmaður veittir styrkir":69,"Kona veittir styrkir":18,"Karlmaður umsóknir":211,"Kona umsóknir":54,"Óskilgreint umsóknir":3},{"fund_year":2016,"Karlmaður veittir styrkir":75,"Kona veittir styrkir":31,"Karlmaður umsóknir":364,"Kona umsóknir":128},{"fund_year":2017,"Karlmaður veittir styrkir":64,"Kona veittir styrkir":37,"Karlmaður umsóknir":367,"Kona umsóknir":141},{"fund_year":2018,"Karlmaður veittir styrkir":54,"Kona veittir styrkir":30,"Karlmaður umsóknir":410,"Kona umsóknir":189,"Óskilgreint umsóknir":1},{"fund_year":2019,"Karlmaður veittir styrkir":54,"Kona veittir styrkir":22,"Karlmaður umsóknir":433,"Kona umsóknir":196,"Óskilgreint umsóknir":1},{"fund_year":2020,"Karlmaður veittir styrkir":66,"Kona veittir styrkir":23,"Karlmaður umsóknir":602,"Kona umsóknir":278,"Óskilgreint umsóknir":2},{"fund_year":2021,"Karlmaður umsóknir":48,"Kona umsóknir":24}]',
    datakeys:
    "[{\"bars\":[{\"datakey\":\"Karlmaður umsóknir\",\"color\":\"#99C0FF\",\"stackId\":\"a\"},{\"datakey\":\"Kona umsóknir\",\"color\":\"#0061FF\",\"stackId\":\"b\"},{\"datakey\":\"Óskilgreint umsóknir\",\"color\":\"#99F4EA\",\"stackId\":\"c\"}],\"lines\":[{\"datakey\":\"Karlmaður veittir styrkir\",\"color\":\"#99C0FF\"},{\"datakey\":\"Kona veittir styrkir\",\"color\":\"#0061FF\"},{\"datakey\":\"Óskilgreint veittir styrkir\",\"color\":\"#99F4EA\"}],\"xAxis\":\"fund_year\",\"yAxis\":{\"left\":true}}]"
  }
}
export const applications = {
  "graphTitle": "Sótt og veitt",
  "graphDescription": "Fjármögnun og framlög sjóða rannsókna- og nýsköpunarsviðs",
  "organization": "Rannís",
  "graph": {
      "title": "Sótt og veitt",
      "type": "Mixed",
      "data": "[{\"Umsóknir\":109,\"fund_year\":2010,\"Veittir styrkir\":23,\"Heildarupphæð styrkja\":127632000},{\"Umsóknir\":223,\"fund_year\":2011,\"Veittir styrkir\":46,\"Heildarupphæð styrkja\":157583000},{\"Umsóknir\":188,\"fund_year\":2012,\"Veittir styrkir\":53,\"Heildarupphæð styrkja\":163385000},{\"Umsóknir\":326,\"fund_year\":2013,\"Veittir styrkir\":61,\"Heildarupphæð styrkja\":606991000},{\"Umsóknir\":234,\"fund_year\":2014,\"Veittir styrkir\":56,\"Heildarupphæð styrkja\":1057143000},{\"Umsóknir\":268,\"fund_year\":2015,\"Veittir styrkir\":87,\"Heildarupphæð styrkja\":2114543000},{\"Umsóknir\":492,\"fund_year\":2016,\"Veittir styrkir\":106,\"Heildarupphæð styrkja\":2461778000},{\"Umsóknir\":508,\"fund_year\":2017,\"Veittir styrkir\":101,\"Heildarupphæð styrkja\":2406155000},{\"Umsóknir\":600,\"fund_year\":2018,\"Veittir styrkir\":84,\"Heildarupphæð styrkja\":1833837000},{\"Umsóknir\":630,\"fund_year\":2019,\"Veittir styrkir\":76,\"Heildarupphæð styrkja\":1594440000},{\"Umsóknir\":882,\"fund_year\":2020,\"Veittir styrkir\":89,\"Heildarupphæð styrkja\":1152500000}]",
      "datakeys": "[{\"bars\":[{\"datakey\":\"Umsóknir\",\"color\":\"#99C0FF\",\"stackId\":\"a\"},{\"datakey\":\"Veittir styrkir\",\"color\":\"#0061FF\",\"stackId\":\"a\"}],\"lines\":[{\"datakey\":\"Heildarupphæð styrkja\",\"color\":\"#99F4EA\"}],\"xAxis\":\"fund_year\",\"yAxis\":{\"left\":\"Heildarupphæð styrkja\"}}]"
  }
}

export const category = {
  "graphTitle": "Úthlutanir eftir flokkum",
  "graphDescription": "Fjöldi úthlutaðra styrkja eftir flokkum frá 2010-2020",
  "organization": "Rannís",
  "graph": {
      "title": "Veitt eftir flokkum",
      "type": "Pie",
      "data": "[{\"name\":\"Menning, hönnun og afþreying\",\"count\":21},{\"name\":\"Almenn matvælatækni\",\"count\":18},{\"name\":\"Almenn verslun og þjónusta (þ.m.t. fjármálaþjónusta og öryggisþjónusta)\",\"count\":15},{\"name\":\"Heilbrigðis- og velferðarþjónusta\",\"count\":15},{\"name\":\"Fræðslu- og menntatengd þjónusta\",\"count\":13},{\"name\":\"Fjarskiptaþjónusta og samgöngur\",\"count\":12},{\"name\":\"Vinnsla lífrænna og ólífrænna efna (önnur en efnaframleiðsla)\",\"count\":10},{\"name\":\"Bygginga- og mannvirkjagerð (þ.m.t. viðhald)\",\"count\":10},{\"name\":\"Hagnýting auðlinda lífríkis á landi (Landbúnaður skógrækt)\",\"count\":9},{\"name\":\"Umhverfis- og skipulagsmál (þ.m.t. vatnsveitur og úrgangur)\",\"count\":9},{\"name\":\"Ferðaþjónusta\",\"count\":7},{\"name\":\"Annað\",\"count\":5}]",
      "datakeys": "{\"datakey\":\"count\"}"
  }
}
