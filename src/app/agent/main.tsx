"use client";
import { useState, useEffect } from "react";
import { ToolsType, AppType } from "../../interface/app";
import { AgentType } from "../../interface/agent";

export default function PromptEditor() {
  const [agents, setAgents] = useState<AgentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectAgent, setSelectedAgent] = useState<AgentType | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    agentId: "",
    behavior: "",
    name: "",
    persona: "",
    style: "",
    xPrompt: "",
    telegramPrompt: "",
    xFollow: [] as string[],
    xTools: [] as ToolsType[],
    tgTools: [] as ToolsType[],
    chatMessage: "",
    tgFirstMessage: "",
  });

  useEffect(() => {
    fetch("/api/agent")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.agents);
        console.log(data.agents);
        setLoading(false);
      });
  }, []);

  const handleClickAgent = async (agentId: string) => {
    setLoading(true);
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agentId }),
    });
    const data = await response.json();
    const agent: AgentType = data.agent;
    setSelectedAgent(agent);

    setFormData({
      agentId: agent.id,
      behavior: agent.dna.behavior,
      name: agent.dna.name,
      persona: agent.dna.persona,
      style: agent.dna.style,
      xPrompt: "",
      telegramPrompt: "",
      xFollow: [],
      xTools: [],
      chatMessage: "",
      tgTools: [],
      tgFirstMessage: "",
    });

    agent.apps.forEach((app: AppType) => {
      if (app.type === "X") {
        setFormData((prev) => ({
          ...prev,
          xPrompt: app.prompt,
          xFollow: app.follow || [],
          xTools:
            app.tools?.map((tool) => ({
              ...tool,
              params: tool.params || [],
            })) || [],
        }));
      }
      if (app.type === "TG")
        setFormData((prev) => ({
          ...prev,
          telegramPrompt: app.prompt,
          tgFirstMessage: app.first_message || "",
          chatMessage: app.chat_message || "",

          tgTools:
            app.tools?.map((tool) => ({
              ...tool,
              params: tool.params || [],
              secrets: tool.secrets || 0,
            })) || [],
        }));
    });

    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (
    key: "xFollow" | "xTools" | "tgTools",
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveAgent = async () => {
    if (!selectAgent) return;
    setSaving(true);

    const response = await fetch("/api/agent", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldId: selectAgent.id,
        newId: formData.agentId,
        behavior: formData.behavior,
        name: formData.name,
        persona: formData.persona,
        style: formData.style,
        xPrompt: formData.xPrompt,
        xFollow: formData.xFollow,
        xTools: formData.xTools,
        tgPrompt: formData.telegramPrompt,
        chatMessage: formData.chatMessage,
        tgTools: formData.tgTools,
        tgFirstMessage: formData.tgFirstMessage,
      }),
    });

    if (response.ok) {
      alert("Agent updated successfully!");
    } else {
      alert("Failed to update agent.");
    }
    setSaving(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Agent
      </h1>
      {loading ? (
        <p className="text-gray-500 text-center">Loading agents...</p>
      ) : (
        <div className="mb-4 border rounded-lg bg-gray-50 p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Select an Agent
          </h2>
          <div className="space-y-2">
            {agents.map((agent: AgentType) => (
              <button
                key={agent.id}
                className={`w-full p-3 text-left whitespace-pre-wrap border rounded-lg shadow-sm transition duration-200 ease-in-out hover:bg-gray-200 ${
                  selectAgent?.id === agent.id
                    ? "bg-blue-100 font-bold"
                    : "bg-white"
                }`}
                onClick={() => handleClickAgent(agent.id)}
              >
                {agent.id}
              </button>
            ))}
          </div>
        </div>
      )}
      {selectAgent && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Agent Information
          </h2>
          <div className="grid grid-cols-1 gap-4 text-gray-600">
            <div>
              <p className="whitespace-pre-wrap">
                <strong>ID:</strong> {formData.agentId}
              </p>
              <textarea
                className="border p-3 w-full rounded-lg whitespace-pre-wrap"
                value={formData.agentId}
                name="agentId"
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="whitespace-pre-wrap">
                <strong>Behavior:</strong> {formData.behavior}
              </p>
              <textarea
                className="border p-3 w-full rounded-lg whitespace-pre-wrap"
                value={formData.behavior}
                name="behavior"
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="whitespace-pre-wrap">
                <strong>Name:</strong> {formData.name}
              </p>
              <textarea
                className="border p-3 w-full rounded-lg whitespace-pre-wrap"
                value={formData.name}
                name="name"
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="whitespace-pre-wrap">
                <strong>Persona:</strong> {formData.persona}
              </p>
              <textarea
                className="border p-3 w-full rounded-lg whitespace-pre-wrap"
                value={formData.persona}
                name="persona"
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="whitespace-pre-wrap">
                <strong>Style:</strong> {formData.style}
              </p>
              <textarea
                className="border p-3 w-full rounded-lg whitespace-pre-wrap"
                value={formData.style}
                name="style"
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="whitespace-pre-wrap">
                <strong>X Prompt:</strong> {formData.xPrompt}
              </p>
              <textarea
                className="border p-3 w-full h-20 rounded-lg whitespace-pre-wrap"
                value={formData.xPrompt}
                name="xPrompt"
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="whitespace-pre-wrap">
                <strong>X Follow:</strong>
                {formData.xFollow.map((follow, index) => (
                  <li key={index}>{follow}</li>
                ))}
              </p>
              {formData.xFollow.map((follow, index) => (
                <div key={index} className="flex space-x-2 mt-2">
                  <input
                    className="border p-2 w-full rounded-lg whitespace-pre-wrap"
                    value={follow}
                    onChange={(e) =>
                      handleArrayChange(
                        "xFollow",
                        formData.xFollow.map((f, i) =>
                          i === index ? e.target.value : f
                        )
                      )
                    }
                  />
                  <button
                    onClick={() =>
                      handleArrayChange(
                        "xFollow",
                        formData.xFollow.filter((_, i) => i !== index)
                      )
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  handleArrayChange("xFollow", [...formData.xFollow, ""])
                }
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Add Follow
              </button>
            </div>
            <div>
              <div>
                <strong>X Tools:</strong>
                {formData.xTools.map((tool, index) => (
                  <div key={index} className="my-2">
                    <strong>Item: </strong>
                    <p className="whitespace-pre-wrap">{tool.item}</p>
                    <strong>Parameters: </strong>
                    {tool.params !== undefined ? (
                      <>
                        {tool.params.map((param, index) => (
                          <li className="whitespace-pre-wrap" key={index}>
                            {param}
                          </li>
                        ))}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </div>
              {formData.xTools.map((tool, toolIndex) => (
                <div
                  key={toolIndex}
                  className="mb-4 p-4 bg-gray-200 rounded-lg"
                >
                  <input
                    className="border p-2 w-full rounded-lg whitespace-pre-wrap"
                    value={tool.item}
                    onChange={(e) =>
                      handleArrayChange(
                        "xTools",
                        formData.xTools.map((f, i) =>
                          i === toolIndex ? { ...f, item: e.target.value } : f
                        )
                      )
                    }
                  />
                  {tool.params !== undefined ? (
                    <>
                      {tool.params.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex space-x-2 mt-2">
                          <input
                            className="border p-2 w-full rounded-lg whitespace-pre-wrap"
                            value={param}
                            onChange={(e) =>
                              handleArrayChange(
                                "xTools",
                                formData.xTools.map((t, i) =>
                                  i === toolIndex
                                    ? {
                                        ...t,
                                        params: t.params.map((p, j) =>
                                          j === paramIndex ? e.target.value : p
                                        ),
                                      }
                                    : t
                                )
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              handleArrayChange(
                                "xTools",
                                formData.xTools.map((t, i) =>
                                  i === toolIndex
                                    ? {
                                        ...t,
                                        params: t.params.filter(
                                          (_, j) => j !== paramIndex
                                        ),
                                      }
                                    : t
                                )
                              )
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                  <div>
                    <button
                      onClick={() =>
                        handleArrayChange(
                          "xTools",
                          formData.xTools.map((t, i) =>
                            i === toolIndex
                              ? {
                                  ...t,
                                  params: Array.isArray(t.params)
                                    ? [...t.params, ""]
                                    : [""],
                                }
                              : t
                          )
                        )
                      }
                      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Add Parameter
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        handleArrayChange(
                          "xTools",
                          formData.xTools.filter((_, i) => i !== toolIndex)
                        )
                      }
                      className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove Tool
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  handleArrayChange("xTools", [
                    ...formData.xTools,
                    { item: "", params: [] },
                  ])
                }
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
              >
                Add Tool
              </button>
            </div>
            <div>
              <p className="whitespace-pre-wrap">
                <strong>Telegram Prompt:</strong> {formData.telegramPrompt}
              </p>
              <textarea
                className="border p-3 w-full h-20 rounded-lg whitespace-pre-wrap"
                value={formData.telegramPrompt}
                name="telegramPrompt"
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="whitespace-pre-wrap">
                <strong>First Message:</strong> {formData.tgFirstMessage}
              </p>
              <textarea
                className="border p-3 w-full h-20 rounded-lg whitespace-pre-wrap"
                value={formData.tgFirstMessage}
                name="tgFirstMessage"
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="whitespace-pre-wrap">
                <strong>Chat Message:</strong> {formData.chatMessage}
              </p>
              <textarea
                className="border p-3 w-full h-20 rounded-lg whitespace-pre-wrap"
                value={formData.chatMessage}
                name="chatMessage"
                onChange={handleChange}
              />
            </div>
            <div>
              <div>
                <strong>Telegram Tools:</strong>
                {formData.tgTools.map((tool, index) => (
                  <div key={index} className="my-2">
                    <strong>Item: </strong>
                    <p className="whitespace-pre-wrap">{tool.item}</p>
                    <strong>Parameters: </strong>
                    {tool.params !== undefined ? (
                      <>
                        {tool.params.map((param, index) =>
                          index >= tool.secrets ? (
                            <li className="whitespace-pre-wrap" key={index}>
                              {param}
                            </li>
                          ) : null
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </div>
              {formData.tgTools.map((tool, toolIndex) => (
                <div
                  key={toolIndex}
                  className="mb-4 p-4 bg-gray-200 rounded-lg"
                >
                  <input
                    className="border p-2 w-full rounded-lg whitespace-pre-wrap"
                    value={tool.item}
                    onChange={(e) =>
                      handleArrayChange(
                        "tgTools",
                        formData.tgTools.map((f, i) =>
                          i === toolIndex ? { ...f, item: e.target.value } : f
                        )
                      )
                    }
                  />
                  {tool.params !== undefined ? (
                    <>
                      {tool.params.map((param, paramIndex) =>
                        paramIndex >= tool.secrets ? (
                          <div key={paramIndex} className="flex space-x-2 mt-2">
                            <textarea
                              className="border p-2 w-full rounded-lg whitespace-pre-wrap"
                              value={param}
                              onChange={(e) =>
                                handleArrayChange(
                                  "tgTools",
                                  formData.tgTools.map((t, i) =>
                                    i === toolIndex
                                      ? {
                                          ...t,
                                          params: t.params.map((p, j) =>
                                            j === paramIndex
                                              ? e.target.value
                                              : p
                                          ),
                                        }
                                      : t
                                  )
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                handleArrayChange(
                                  "tgTools",
                                  formData.tgTools.map((t, i) =>
                                    i === toolIndex
                                      ? {
                                          ...t,
                                          params: t.params.filter(
                                            (_, j) => j !== paramIndex
                                          ),
                                        }
                                      : t
                                  )
                                )
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        ) : null
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                  <div>
                    <button
                      onClick={() =>
                        handleArrayChange(
                          "tgTools",
                          formData.tgTools.map((t, i) =>
                            i === toolIndex
                              ? {
                                  ...t,
                                  params: Array.isArray(t.params)
                                    ? [...t.params, ""]
                                    : [""],
                                }
                              : t
                          )
                        )
                      }
                      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Add Parameter
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        handleArrayChange(
                          "tgTools",
                          formData.tgTools.filter((_, i) => i !== toolIndex)
                        )
                      }
                      className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove Tool
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  handleArrayChange("tgTools", [
                    ...formData.tgTools,
                    { item: "", params: [] },
                  ])
                }
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
              >
                Add Tool
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveAgent}
            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Agent"}
          </button>
        </div>
      )}
    </div>
  );
}
