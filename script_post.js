// 参加者IDを入力するためのトライアル
var participant_id_input = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: "参加者IDを入力してください:",
      name: 'participant_id',
      required: true
    }
  ],
  data: {
    block_number: "参加者ID入力"
  },
  on_finish: function(data) {
    var participant_id = data.response.participant_id;
    jsPsych.data.addProperties({ participant_id: participant_id });
  }
};

// jsPsychを初期化
var jsPsych = initJsPsych({
  on_finish: function () {
    // データを保存する処理
    var all_data = jsPsych.data.get().values();
    var idNumber = all_data.find(d => d.participant_id !== undefined).participant_id;
    var filename = "post_" + idNumber + ".csv";
    jsPsych.data.get().localSave('csv', filename);
  }
});

// スタイルを定義する <style> タグを追加
var styleElement = document.createElement('style');
styleElement.innerHTML = `
  .iat-stimulus {
    font-size: 36px;
    line-height: 1.5;
  }
  .jspsych-survey-likert-statement {
    font-size: 36px;
  }
  .category-label {
    color: green; /* [文化系/体育会系] のラベルを緑色に */
    font-weight: bold;
  }
  .sports-stimulus, .culture-stimulus {
    color: green; /* 該当する刺激語を緑色に */
  }
`;
document.head.appendChild(styleElement);

// 刺激リストを定義
var male_stimuli = ["父", "お兄さん", "息子", "叔父", "おじさん"];
var female_stimuli = ["母", "お姉さん", "娘", "おばあちゃん", "妹"];
var sports_stimuli = [
  "<span class='sports-stimulus'>陸上</span>",
  "<span class='sports-stimulus'>野球</span>",
  "<span class='sports-stimulus'>バスケットボール</span>",
  "<span class='sports-stimulus'>ボクシング</span>",
  "<span class='sports-stimulus'>柔道</span>"
];
var culture_stimuli = [
  "<span class='culture-stimulus'>放送</span>",
  "<span class='culture-stimulus'>吹奏楽</span>",
  "<span class='culture-stimulus'>アート</span>",
  "<span class='culture-stimulus'>ボードゲーム</span>",
  "<span class='culture-stimulus'>書道</span>"
];

// IATブロックを作成するための関数
function createIatBlock(block_number, left_label, right_label, stimuli, practice) {
  var timeline_variables = [];
  
  // 練習ブロックは20回、本番ブロックは40回の試行を生成
  for (let i = 0; i < (practice ? 20 : 40); i++) { 
    let stimulus;
    let key_association;
    
    // 50%の確率で左右のカテゴリーからランダムに刺激を選択
    if (Math.random() < 0.5) {
      stimulus = stimuli[0][Math.floor(Math.random() * stimuli[0].length)];
      key_association = "left";
    } else {
      stimulus = stimuli[1][Math.floor(Math.random() * stimuli[1].length)];
      key_association = "right";
    }
    
    // 選択した刺激と正解のキーを timeline_variables に追加
    timeline_variables.push({ stimulus: stimulus, key_association: key_association });
  }

  // IATブロックの設定を返す
  return {
    timeline: [{
      type: jsPsychIatHtml,
      stimulus: jsPsych.timelineVariable('stimulus'),
      stimulus_duration: 1000,
      css_classes: ['iat-stimulus'],
      stim_key_association: jsPsych.timelineVariable('key_association'),
      html_when_wrong: '<span style="color: red; font-size: 80px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">X</span>',
      bottom_instructions: '<p>間違ったキーを押すと、赤いXが表示されます。別のキーを押して続行してください。</p>',
      force_correct_key_press: true,
      display_feedback: true,
      left_category_key: 'e',
      right_category_key: 'i',
      left_category_label: left_label,
      right_category_label: right_label,
      response_ends_trial: true,
      data: {
        block_number: block_number,
        practice: practice ? "練習" : "本番"
      },
      on_finish: function() {
        jsPsych.data.displayData(); //IATブロック終了後に追加
      }
    }],
    timeline_variables: timeline_variables,
    randomize_order: true
  };
}

// 説明画面を作成するための関数
function createInstructions(block_number, left_label, right_label) {
  // カテゴリラベルのみを緑色にする
  function highlightCategories(labels) {
    return labels.map(label => {
      if (label === '文化系' || label === '体育会系') {
        return `<span class="category-label">${label}</span>`;
      } else {
        return label;
      }
    }).join('または');
  }

  var left_label_text = highlightCategories(left_label);
  var right_label_text = highlightCategories(right_label);

  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
      <h1>ブロック${block_number}</h1>
      <p>このブロックでは、左側に「${left_label_text}」、右側に「${right_label_text}」が表示されます。</p>
      <p>中央に表示される単語が左側のカテゴリーに属する場合は「E」キー、右側のカテゴリーに属する場合は「I」キーを押してください。</p>
      <p>できるだけ速く正確に反応してください。</p>
      <p>準備ができたら、エンターキーを押して開始してください。</p>
    `,
    choices: ['Enter']
  };
}

// フルスクリーンブロック
var fullscreen_trial = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  message: '<p>実験を開始します。画面をフルスクリーンにしてください。</p>',
  button_label: 'フルスクリーンにする'
};

// スタートページ
var start_page = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <h1>実験にご参加いただきありがとうございます</h1>
    <p>この実験では、あなたに関する簡単な質問と、IATテストを行います。</p>
    <p>実験は匿名で行われ、データは厳重に保管されますのでご安心ください。</p>
    <p>実験は10分程度で終了します。</p>
    <p>準備ができたら、下のボタンをクリックして開始してください。</p>
  `,
  choices: ['開始']
};

// 1つ目の質問紙調査
var survey_page = {
  type: jsPsychSurveyLikert,
  questions: [
    {
      prompt: "Q1. 年齢",
      labels: ["18歳未満", "18歳", "19歳", "20歳", "21歳", "22歳", "23歳", "24歳", "25歳", "26歳", "27歳", "28歳", "29歳", "30歳以上"],
      required: true
    },
    {
      prompt: "Q2. 性別",
      labels: ["男性", "女性", "その他"],
      required: true
    },
    {
      prompt: "Q3. 過去に所属したことのある部活動",
      labels: ["体育会系", "文化系", "両方", "所属していない"],
      required: true
    },
    {
      prompt: "Q4. あなたは<b>体育会系</b>をどの程度男性的もしくは女性的だと考えますか？",
      labels: ["非常に男性的", "男性的", "やや男性的", "どちらでもない", "やや女性的", "女性的", "非常に女性的"],
      required: true
    },
    {
      prompt: "Q5. あなたは<b>文化系</b>をどの程度男性的もしくは女性的だと考えますか？",
      labels: ["非常に男性的", "男性的", "やや男性的", "どちらでもない", "やや女性的", "女性的", "非常に女性的"],
      required: true
    },
    {
      prompt: "Q6. あなた自身のジェンダーアイデンティティを最もよく表しているいるものはなんですか？",
      labels: ["男性に対して強く同一視している", "男性に同一視している", "やや男性について同一視している", "どちらでもない", "やや女性について同一視している", "女性に同一視している", "女性に対して強く同一視している"],
      required: true
    }
  ],
  data: {
    block_number: "質問紙1"
  },
  button_label: '次へ',
  preamble: `<div style="text-align: left">
    <p>以下の質問にお答えください。</p>
  </div>`
};

// 2つ目の質問紙調査（新規追加）
var second_survey_page = {
  type: jsPsychSurveyLikert,
  questions: [
    {prompt: "1. 仮想身体が自分の身体のように感じられた。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true},
    {prompt: "2. 仮想の身体部位が自分の身体部位のように感じられた。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true},
    {prompt: "3. 仮想身体は人間らしさがあると感じた。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true},
    {prompt: "4. 仮想身体が自分に属するものと感じた。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true},
    {prompt: "5. 仮想身体の動作が、まるで自分自身の動作のように感じた。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true},
    {prompt: "6. 仮想身体の動作を、自分でコントロールしている気がした。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true},
    {prompt: "7. 仮想身体の動作を、自分で引き起こしている気がした。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true},
    {prompt: "8. 仮想身体の動作が、自分自身の動作と一致していた。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true},
    {prompt: "9. 自分自身の身体の形や見かけが変化した気がした。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true},
    {prompt: "10. 自分自身の体重に変化があった気がした。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true},
    {prompt: "11. 自分自身の身長に変化があった気がした。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true},
    {prompt: "12. 自分自身の体の横幅に変化があった気がした。", labels: ["1:まったく当てはまらない", "2:当てはまらない", "3:どちらかと言えば当てはまらない", "4:どちらでもない", "5:どちらかと言えば当てはまる", "6:当てはまる", "7:完全に当てはまる"], required: true}
  ],
  data: {
    block_number: "質問紙2"
  },
  button_label: '次へ',
  preamble: `<div style="text-align: left">
    <p>以下の質問にお答えください。(1:まったく当てはまらない ー 7:完全に当てはまる)</p>
  </div>`
};


// IATブロックを定義
var block_1 = createIatBlock(1, ['男性'], ['女性'], [male_stimuli, female_stimuli], true);
var block_2 = createIatBlock(2, ['体育会系'], ['文化系'], [sports_stimuli, culture_stimuli], true);
var block_3 = createIatBlock(3, ['男性', '体育会系'], ['女性', '文化系'], [male_stimuli.concat(sports_stimuli), female_stimuli.concat(culture_stimuli)], true);
var block_4 = createIatBlock(4, ['男性', '体育会系'], ['女性', '文化系'], [male_stimuli.concat(sports_stimuli), female_stimuli.concat(culture_stimuli)], false);
var block_5 = createIatBlock(5, ['文化系'], ['体育会系'], [culture_stimuli, sports_stimuli], true);
var block_6 = createIatBlock(6, ['男性', '文化系'], ['女性', '体育会系'], [male_stimuli.concat(culture_stimuli), female_stimuli.concat(sports_stimuli)], true);
var block_7 = createIatBlock(7, ['男性', '文化系'], ['女性', '体育会系'], [male_stimuli.concat(culture_stimuli), female_stimuli.concat(sports_stimuli)], false);

// 説明画面を定義
var instructions_1 = createInstructions(1, ['男性'], ['女性']);
var instructions_2 = createInstructions(2, ['体育会系'], ['文化系']);
var instructions_3 = createInstructions(3, ['男性', '体育会系'], ['女性', '文化系']);
var instructions_4 = createInstructions(4, ['男性', '体育会系'], ['女性', '文化系']);
var instructions_5 = createInstructions(5, ['文化系'], ['体育会系']);
var instructions_6 = createInstructions(6, ['男性', '文化系'], ['女性', '体育会系']);
var instructions_7 = createInstructions(7, ['男性', '文化系'], ['女性', '体育会系']);

// グループAとグループBを定義（順序固定内で1つのグループ）
var group_A = [
  { instructions: instructions_2, block: block_2 },
  { instructions: instructions_3, block: block_3 },
  { instructions: instructions_4, block: block_4 }
];

var group_B = [
  { instructions: instructions_5, block: block_5 },
  { instructions: instructions_6, block: block_6 },
  { instructions: instructions_7, block: block_7 }
];

// ブロックの順序をランダム化（グループAとグループBの順序）
var randomized_groups = jsPsych.randomization.shuffle([group_A, group_B]);

// ブロックグループの順序を固定しつつランダム化（A then B or B then A）
var block_group_order = randomized_groups;

// 終了ページを定義
var end_page = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p>実験は終了しました。ご協力ありがとうございました。</p>`,
  choices: ['終了']
};

// タイムラインを定義
var timeline = [];

// 1. フルスクリーン
timeline.push(fullscreen_trial);

// 2. スタートページ
timeline.push(start_page);

// 3. 参加者ID入力
timeline.push(participant_id_input);

// 4. 1つ目の質問紙調査
timeline.push(survey_page);

// 5. 2つ目の質問紙調査
timeline.push(second_survey_page);

// 6. 初期IATブロック1（男性 vs 女性）
timeline.push(instructions_1);
timeline.push(block_1);

// 7. グループAとグループBの順序をランダム化して追加
block_group_order.forEach(function(group) {
  group.forEach(function(item) {
    timeline.push(item.instructions);
    timeline.push(item.block);
  });
});

// 9. 終了ページ
timeline.push(end_page);

// 実験を開始
jsPsych.run(timeline);