import { useState } from "react";
import { Note, Octave, InstrumentName } from "@/types/instruments";
import { instrumentIcons } from "@/constants/instrumentIcons";
import { instrumentRanges } from "@/constants/instruments";
import {
  getAvailableNotes,
  getAvailableOctaves,
  playInstrumentSound,
} from "@/utils/instrumentUtils";
import VolumeKnob from "./VolumeKnob";
import RangeSlider from "./RangeSlider";
import { GiTunePitch } from "react-icons/gi";
import { IoMdMusicalNote } from "react-icons/io";

interface InstrumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (instrument: InstrumentName, pitch: string) => void;
}

export const InstrumentModal: React.FC<InstrumentModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentName>("piano");
  const [selectedNote, setSelectedNote] = useState<Note>("");
  const [selectedOctave, setSelectedOctave] = useState<Octave>("");

  const availableNotes = getAvailableNotes(selectedInstrument, instrumentRanges);
  const availableOctaves = getAvailableOctaves(selectedInstrument, selectedNote, instrumentRanges);

  const handleSelectNote = (note: string) => {
    setSelectedNote(note);
    setSelectedOctave("");
  };
  const handleInstrumentChange = (name: InstrumentName) => {
    setSelectedInstrument(name);
    setSelectedNote("");
    setSelectedOctave("");
  };

  const handleSelect = () => {
    if (selectedNote && selectedOctave) {
      onSelect(selectedInstrument, `${selectedNote}${selectedOctave}`);
      setSelectedNote("");
      setSelectedOctave("");
      onClose();
    }
  };

  const renderInstrumentControls = () => {
    if (selectedInstrument === "bass") {
      const availableSounds = Object.entries(instrumentRanges[selectedInstrument]);

      return (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {availableSounds.map(([note, octaves]) =>
            octaves.map((octave) => (
              <button
                key={`${note}${octave}`}
                onClick={() => {
                  setSelectedNote(note as Note);
                  setSelectedOctave(octave as Octave);
                }}
                className={`p-3 rounded-lg transition-colors ${
                  selectedNote === note && selectedOctave === octave
                    ? "bg-indigo-600 text-white"
                    : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                }`}
              >
                {`${note}${octave} Bass`}
              </button>
            ))
          )}
        </div>
      );
    }

    return (
      <>
        <div>
          <h3 className="text-neutral-200 w-full flex items-center justify-center select-none">
            {`${selectedNote}-${selectedOctave}` || <IoMdMusicalNote />}
          </h3>
          <div className="w-full h-auto p-2">
            <VolumeKnob note={selectedNote} notes={availableNotes} setNote={handleSelectNote} />
          </div>
        </div>

        <div className="mb-4 w-full">
          <RangeSlider
            selectedOctave={selectedOctave}
            setSelectedOctave={setSelectedOctave}
            octaves={availableOctaves}
          />
        </div>
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 w-auto h-auto">
      <div className="bg-neutral-800 p-6 rounded-lg min-w-96 w-[40vw]">
        <h2 className="text-neutral-200 text-lg mb-4">
          <GiTunePitch />
        </h2>
        <div className="mb-2">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(instrumentIcons).map(([name, icon]) => (
              <button
                key={name}
                onClick={() => handleInstrumentChange(name as InstrumentName)}
                className={`flex items-center justify-center gap-2 p-4 rounded-lg transition-colors ${
                  selectedInstrument === name
                    ? "bg-indigo-600 text-white"
                    : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <span className="capitalize">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {renderInstrumentControls()}

        <div className="flex justify-between gap-2 mt-4">
          <button
            onClick={() => {
              if (selectedNote && selectedOctave) {
                playInstrumentSound(
                  selectedInstrument,
                  `${selectedNote}${selectedOctave}`,
                  selectedInstrument === "drums" || selectedInstrument === "bass" ? "wav" : "mp3"
                );
              }
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            disabled={!selectedNote || !selectedOctave}
          >
            <div className="flex items-center gap-2">
              <span>Preview</span>
              <IoMdMusicalNote />
            </div>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-600 text-neutral-200 rounded hover:bg-orange-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              disabled={!selectedNote || !selectedOctave}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
