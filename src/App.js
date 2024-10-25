import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [], previousInput: "" };
  }

  getWordFrequency = (text) => {
    const stopWords = new Set(["the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that", "which", "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it", "its", "we", "us", "our", "ours", "they", "them", "theirs", "I", "me", "my", "myself", "you", "your", "yourself", "yourselves", "was", "were", "is", "am", "are", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "as", "if", "each", "how", "which", "who", "whom", "what", "this", "these", "those", "that", "with", "without", "through", "over", "under", "above", "below", "between", "among", "during", "before", "after", "until", "while", "of", "for", "on", "off", "out", "in", "into", "by", "about", "against", "with", "amongst", "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't", "doesn't", "didn't", "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't", "shouldn't", "mustn't", "needn't", "daren't", "hasn't", "haven't", "hadn't"]);
    
    const words = text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=_`~()]/g, "")
      .replace(/\s{2,}/g, " ")
      .split(" ");
    
    const filteredWords = words.filter((word) => !stopWords.has(word));
    
    return Object.entries(
      filteredWords.reduce((freq, word) => {
        freq[word] = (freq[word] || 0) + 1;
        return freq;
      }, {})
    ).sort((a, b) => b[1] - a[1]).slice(0, 5); // Get top 5 directly here
  };

  updateChart = (newWordFrequency) => {
    const container = d3.select(".child2");
    const words = container.selectAll("span")
      .data(newWordFrequency, d => d[0]); // Use the word itself as the key

    // Enter new words
    words.enter()
      .append("span")
      .text(d => d[0] + " ") // Display only the word
      .style("font-size", "0px") // Start with size 0px
      .style("opacity", 0) // Start with 0 opacity
      .style("position", "absolute") // Absolute positioning for overlap
      .style("margin-right", "30px") // Add margin for spacing between words
      .style("transform", (d, i) => `translateX(${i * 200}px)`) // Start at final position
      .transition() // Add transition for entering words
      .delay((d, i) => i * 300) // Short delay for each new word
      .duration(1000) // Duration of the transition
      .style("font-size", d => `${d[1] * 7}px`) // Grow to final size based on frequency
      .style("opacity", 1) // Fade in
      .style("transform", (d, i) => `translateX(${i * 200}px)`); // Set final position

    // Update existing words
    words.transition()
      .duration(1000) // Transition duration
      .style("font-size", d => `${d[1] * 7}px`) // Update font size
      .style("opacity", 1) // Ensure opacity is 1
      .style("transform", (d, i) => `translateX(${i * 200}px)`); // Maintain final position

    // Exit removed words
    words.exit()
      .transition()
      .duration(1000) // Duration of the exit transition
      .style("opacity", 0) // Fade out
      .remove(); // Remove from DOM after fading out
  };

  handleInputChange = () => {
    const input_data = document.getElementById("input_field").value;
    if (input_data !== this.state.previousInput) {
      const newWordFrequency = this.getWordFrequency(input_data);
      this.setState({ 
        wordFrequency: newWordFrequency,
        previousInput: input_data 
      }, () => this.updateChart(newWordFrequency));
    }
  };

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea
            type="text"
            id="input_field"
            style={{ height: 150, width: 1000 }}
          />
          <button
            type="submit"
            value="Generate Matrix"
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={this.handleInputChange}
          >
            Generate Word Data
          </button>
        </div>
        <div className="child2"></div> {/* D3 will append word data here */}
      </div>
    );
  }
}

export default App;
