"use client"

import React, { useState, useMemo, useCallback } from 'react';
import {
  WastedEntry,
  useGetShiftsQuery,
  useCreateShiftMutation,
  useDeleteShiftMutation,
  NewShift,
  Shift,
} from '@/state/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const defaultEntry: WastedEntry = {
  category: 'RAINSN_PLA_NONE_NO_NO_4M0845543',
  problem: 'DECOLLAGE',
  Quantity: 0,
};

const ShiftPage = () => {
  const { data: shifts = [], isLoading, isError } = useGetShiftsQuery();
  const [createShift] = useCreateShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState<NewShift>({
    shiftType: 'MORNING',
    ligneType: 'LIGNE1',
    date: '',
    technicien: '',
    wastedEntries: [defaultEntry],
  });

  const [filter, setFilter] = useState({
    shiftType: 'ALL',
    ligneType: 'ALL',
    category: 'ALL',
    problem: 'ALL',
    startDate: '',
    endDate: '',
  });

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleEntryChange = useCallback(
    (index: number, field: keyof WastedEntry, value: string | number) => {
      setForm((prev) => {
        const entries = prev.wastedEntries.map((entry, i) =>
          i === index ? { ...entry, [field]: value } : entry
        );
        return { ...prev, wastedEntries: entries };
      });
    },
    []
  );

  const addWastedEntry = useCallback(
    () =>
      setForm((prev) => ({
        ...prev,
        wastedEntries: [...prev.wastedEntries, defaultEntry],
      })),
    []
  );

  const removeWastedEntry = useCallback(
    (index: number) =>
      setForm((prev) => ({
        ...prev,
        wastedEntries: prev.wastedEntries.filter((_, i) => i !== index),
      })),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date) return setFormError('Date is required.');
    const totalWasted = form.wastedEntries.reduce((sum, e) => sum + e.Quantity, 0);
    try {
      setFormError(null);
      await createShift({ ...form, totalWasted }).unwrap();
      setForm({ shiftType: 'MORNING', ligneType: 'LIGNE1', date: '', technicien: '', wastedEntries: [defaultEntry] });
    } catch (err) {
      console.error(err);
      setFormError('Failed to create shift.');
    }
  };

  const chartData = useMemo(() => {
    const problemMap: Record<string, number> = {};

    shifts.forEach((s) => {
      // Shift filter
      if (filter.shiftType !== 'ALL' && s.shiftType !== filter.shiftType) return;
      if (filter.ligneType !== 'ALL' && s.ligneType !== filter.ligneType) return;
      // Date range filter
      const shiftDate = new Date(s.date);
      if (filter.startDate && shiftDate < new Date(filter.startDate)) return;
      if (filter.endDate && shiftDate > new Date(filter.endDate)) return;

      s.wastedEntries.forEach((entry) => {
        // Category and problem filter must both match
        if (filter.category !== 'ALL' && entry.category !== filter.category) return;
        if (filter.problem !== 'ALL' && entry.problem !== filter.problem) return;

        problemMap[entry.problem] = (problemMap[entry.problem] || 0) + entry.Quantity;
      });
    });

    return Object.entries(problemMap).map(([name, wasted]) => ({ name, wasted }));
  }, [shifts, filter]);

  if (isError) return <p className="text-red-600">Error loading shifts.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Create Form */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Create New Shift</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              name="shiftType"
              value={form.shiftType}
              onChange={handleInputChange}
              className="p-2 border rounded"
            >
              <option value="MORNING">Morning</option>
              <option value="MIDDAY">Midday</option>
              <option value="NIGHT">Night</option>
            </select>
            <select
              name='ligneType'
              value={form.ligneType}
              onChange={handleInputChange}
              className="p-2 border rounded"
            >
              <option value="LIGNE1">Ligne 1</option>
              <option value="LIGNE2">Ligne 2</option>
            </select>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="technicien"
              placeholder="Technician"
              value={form.technicien}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
          </div>
          {form.wastedEntries.map((entry, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <select
                value={entry.category}
                onChange={(e) => handleEntryChange(idx, 'category', e.target.value)}
                className="p-2 border rounded"
              >
              <option value="RAINSN_PLA_NONE_NO_NO_4M0845543">RAINSN.PLA.NONE.NO..NO.4M0845543</option>
<option value="RAS_OTH_NO_NO_NPL_P_XXX_01_00_00_0">RAS.OTH.NO..NO..NPL.P.XXX.01.00.00.0</option>
<option value="CAM_BRKT_SE270_WS_6F0_868_033_SE270_DRW">CAM.BRKT.SE270.WS.6F0_868_033_SE270_DRW_</option>
<option value="CAM_BRKT_SE216_WS_6F9_868_033_SE216_D">CAM.BRKT.SE216.WS.6F9_868_033____SE216_D</option>
<option value="RAS_OTH_NO_PUR_NPL_RS_HFEPH2">RAS.OTH.NO..PUR.NPL.RS_HFEPH2</option>
<option value="FRM_SOF_EPDM_EXTR_WS_UP_PROF_SE270">FRM.SOF.EPDM.EXTR.WS.UP.PROF.SE270</option>
<option value="FRM_SOF_EPDM_EXTR_WS_AEST_UP_PROF_SE270">FRM.SOF.EPDM.EXTR.WS.AEST.UP.PROF.SE270</option>
<option value="FRM_SOF_EPDM_ROLL_WS_LOW_PROF_SE270">FRM.SOF.EPDM.ROLL.WS.LOW.PROF.SE270</option>
<option value="PROFILE_SUPERIEUR_SE216">Pofile supérieur SE216</option>
<option value="LOWER_PROFIL_SE216_WITH_OPENING">Lower Profil SE216 with opening</option>
<option value="LOWER_PROFIL_VW216">Lower Profil VW216</option>
<option value="PROFILE_SUPERIEUR_VW216">Pofile supérieur VW216</option>
<option value="FRM_FLU_TPE_ROLL_WS_P2J0_SGS_201_2242">FRM.FLU.TPE.ROLL.WS.P2J0.SGS_201_2242</option>
<option value="SPACER_5X5_3X40_FRANCEM_EPDM_SE270">SPACER.5x5,3x40.FRANCEM.EPDM.SE270</option>
<option value="FRM_FLU_TPE_STRE_WS_VW276_DRAWING_040316">FRM.FLU.TPE.STRE.WS.VW276.DRAWING_040316</option>
<option value="HELLA_4_7_RSA_BRACKET_JFC_BJA_B10">HELLA 4.7 RSA BRACKET (JFC BJA B10)</option>
<option value="BLISTER_HELLA_4_7_RSA_NISSAN">BLISTER HELLA 4.7 RSA / Nissan</option>
<option value="AGRAFFE_PA66_C41_WS_EDGE_CLIP">AGRAFFE.PA66.C41.WS.EDGE.CLIP</option>
<option value="HALTEPLATTE_R_BAS_MKF_P_N_2GA868033">HALTEPLATTE.R.BAS.MKF.P/N.2GA868033</option>
<option value="CAMERA_PLATE_2GM_868_033_A">Camera plate 2GM 868 033 A</option>
<option value="BLISTER_RAIN_SENSOR_MB_PLASTIC">BLISTER RAIN SENSOR / MB (Plastic )</option>
<option value="NAVY_BLUE_PLASTIC_SPACER_26_6MM_BFC2">Navy blue plastic spacer 26.6mm BFC2</option>
<option value="CAM_BRKT_OTH_NO_NO_PLA_2GM_868_033_C_DR">CAM.BRKT.OTH.NO.NO.PLA.2GM_868_033_C_DRW</option>
<option value="HALTEPLATTE_R_BAS_MKF_P_N_2GA868033B">HALTEPLATTE.R.BAS.MKF.P/N.2GA868033B</option>
<option value="VICS_BRACKET_4N0_907_720">VICS bracket 4N0.907.720</option>
<option value="LOCATOR_PIN_P21_PLA_INJ">LOCATOR.PIN.P21.PLA.INJ.</option>
<option value="COVER_BRACKET_PA66GF30_WS_PSA_CP4">COVER.BRACKET.PA66GF30.WS.PSA.CP4</option>
<option value="CAB_X_OTH_WS_D_PP_N_2GM_868_033_D">CAB.X.OTH.WS.D.PP.N.2GM.868.033.D</option>
<option value="G_C41_WS_N_PA663_CITC41WSDEM_HY_OTH">G.C41.WS.N.PA663.CITC41WSDEM-HY.OTH</option>
<option value="OTH_G_VW276_WS_X_C_PBT_N_2GA_868_033_C">OTH.G.VW276.WS.X.C.PBT.N.2GA.868.033.C</option>
<option value="SPACER_VW_5_3_MMX5X20_MM">Spacer VW 5,3 mmx5x20 mm</option>
<option value="FRM_USH_TPE_CORN_WS_PSA_C_C41_01_00_00_0">FRM.USH.TPE.CORN.WS.PSA.C-C41-01-00-00-0</option>
<option value="FRM_FLU_TPE_STRE_WS_VW276_TAB_008_899_A">FRM.FLU.TPE.STRE.WS.VW276.TAB.008.899.A</option>
<option value="ACT_DUP_BETAWIPE_VP04604_1L">ACT. DUP. BETAWIPE - VP04604 1L</option>
<option value="PRIDUP_BETAPRIME_5404_1L">PRI.DUP.BETAPRIME-5404.1L</option>
<option value="PRILDUP_BETAPRIME_5500_1L">PRI.DUP.BETAPRIME-5500.1L</option>
<option value="PRIDUP_BETAPRIME_5550_1L">PRI.DUP.BETAPRIME-5550.1L</option>
<option value="PRI_DUP_BETAPRIME_5026_1L">PRI.DUP.BETAPRIME-5026.1L</option>
<option value="STILDUP_BETASEAL_1965_1F_300ML">STI.DUP.BETASEAL-1965-1F.300ML</option>
<option value="STI_DUP_BETASEAL_1965_1F_22L">STI.DUP.BETASEAL-1965-1F.22L</option>
<option value="JINETILLO_PASO_18">Jinetillo paso 18</option>
<option value="JINETILLO_PASO_21">Jinetillo paso 21</option>
<option value="BANDE_DE_BALISAGE">bande de balisage</option>
<option value="MARQUEUR_BLEU">Marqueur bleu</option>
<option value="CISEAUX_DE_CERCLAGE">Ciseaux de cerclage</option>
<option value="JINETILLO_MARRON_M_18_0A">Jinetillo Marrón M.18.0A</option>
<option value="JINETILLO_NARANJA_T_21_0A">Jinetillo naranja T.21.0A</option>
<option value="CREMALLI_RES_PASO_32_VW216">Crémallières paso 32 VW216</option>
<option value="CREMALLI_RE_C41_PASO_28_COLD_VERSION">Cremallière C41 paso 28 COLD version</option>
<option value="RAMETTE_PAPIER_A">ramette papier A6</option>
<option value="SERRE_TETE_POUR_ECRAN_FACIAL">SERRE TETE POUR ECRAN FACIAL</option>
<option value="ECRAN_ADAPTABLE_VISOR_BORD_METAL">ECRAN ADAPTABLE VISOR BORD METAL</option>
<option value="FIELTRO_C_BLANCO_DIAMETRE_10X20_MM">Fieltro c-blanco Diametre 10x20 mm</option>
<option value="FIELTRO_C_BLANCO_26X20X10_MM">Fieltro c-blanco 26x20x10 mm</option>
<option value="TETE_DE_BIBERON_26X20X10_MM">Tete de biberon 26x20x10 mm</option>
<option value="T_TE_DE_PRIMAGE_D10_MM">Tête de primage D10 mm</option>
<option value="T_TE_DE_PRIMAGE_D1_MODIFI">Tête de primage D16 modifié</option>
<option value="SCOTCH_HAUTE_TEMPERATURE">scotch haute température</option>
<option value="ETIQUETTE_BT5026">Etiquette BT5026</option>
<option value="ETIQUETTE_VP04604">Etiquette VP04604</option>
<option value="ETIQUETTE_BT5500">Etiquette BT5500</option>
<option value="SCOTCH_DOUBLE_FACE">Scotch double face</option>
<option value="ETIQUETTE_BC3300">Etiquette BC3300</option>
<option value="DRYING_BAG_10GR_ORANGE_SILICA_GEL_TYPE_0">DRYING BAG 10GR ORANGE SILICA GEL TYPE 0</option>
<option value="SOBRE_ADHESIVO_240_X_180_MM_TRANSPAREN">SOBRE ADHESIVO 240 X 180 MM. TRANSPARENT</option>
<option value="BOLSA_PE_TRANSP_MICROPER_1550_1500X1780">Bolsa PE transp microper 1550+1500x1780</option>
<option value="BIBERON_PRIMER_301_100">BIBERON  PRIMER  301.100</option>
<option value="LAMES_POUR_LIGNE_DE_CONTROLE">LAMES  POUR LIGNE DE CONTROLE</option>
<option value="JUEGO_CREMALLERA_REF_09441_ESPUMA_POLIE">Juego cremallera ref.09441 espuma polie.</option>
<option value="FIELTRE_D_16X20_MM">Fieltre D 16x20 mm</option>
<option value="FIELTRO_C_BLANCO_22X20_MM">Fieltro c-blanco 22x20 mm</option>
<option value="BAGUETTES_BOIS_POUR_RACK_CUSTODE">Baguettes bois pour Rack custode</option>
<option value="RAMETTE_PAPIER_A4">Ramette PAPIER A4</option>
<option value="CAMERA_VW216_INDICE_B">CAMERA VW216 INDICE B</option>
<option value="CAMERA_VW216_INDICE_C">CAMERA VW216 INDICE C</option>
<option value="CREMALLI_RES_18_SE270_SE216">Crémallières 18 se270/se216</option>
<option value="CREMALLI_RES_21_SE270_SE216">Crémallières 21 se270/se216</option>
<option value="HP_LASER_JET_PRO_M404DN_CF259A">HP LASER JET Pro M404DN CF259A</option>
<option value="AUTOCOLLANTS_SE216">Autocollants se216</option>
<option value="AUTOCOLLANTS_SE270">Autocollants se270</option>
<option value="CAVALIERS_C41_N28_0A_COLD_VERSION">Cavaliers C41 N28.0A cold Version</option>
<option value="CREMALLI_RE_C41_PASO_40_HEATED_VERSION">Cremallière C41 paso 40 Heated version</option>
<option value="CAVALIERS_C41_N40_0A_HEATED_VERSION">Cavaliers C41 N40.0A Heated Version</option>
<option value="CR_MALLI_RES_PASO_34_VW_SEAT">Crémallières paso 34 VW/SEAT</option>
<option value="CAVALIERS_C41_COLD">Cavaliers C41 cold</option>
<option value="CREMALLI_RES_PASO_32_VW276">Crémallières paso 32 VW276</option>
<option value="CREMALLI_RE_RACK_R006_90">Crémallière rack R006.90</option>
<option value="PAQUET_DE_100_SERRE_CABLE_EN_PLASTIQUE">Paquet de 100 serre cable en plastique</option>
<option value="CUBE_ADH_SIF_900_E_02493">Cube adhésif  900-E+02493</option>
<option value="GANTS_NITRIL_JETABLE_NON_POUDRE">Gants Nitril jetable non poudre</option>
<option value="BOAUILLAS_WS_XPA_PARA_FIELTRO_DE_D22X2">Boquillas WS (XPA) para fieltro de D22x2</option>
<option value="BOAUILLAS_WS_DLP_L_PARA_FIELTRO_DE_D16">Boquillas WS (DLP-L) para fieltro de D16</option>
<option value="WIPEOFF_BOBINE_IND_PURE_OUATE_150M">WIPEOFF BOBINE IND. pure ouate 150m</option>
<option value="CLE_DUPONT_BETACLEAN_3300_XXX">CLE.DUPONT.BETACLEAN 3300.XXX</option>
<option value="CRAYON_MARQUAGE_DES_DEFAUTS_STAEDTLER">Crayon marquage des défauts STAEDTLER</option>
<option value="TETE_DE_CLEANER">Tete de cleaner</option>
<option value="ETIQUETTE_BLANCHE_ETIKA_70MM_X_37MM">ETIQUETTE BLANCHE ETIKA 70mm X 37mm</option>
<option value="GANTS_ANTI_ACIDE">GANTS ANTI-ACIDE</option>
<option value="BANDE_DE_PROTECTION_VERRE">Bande de protection verre</option>
<option value="TABLIER_FOUR">Tablier Four</option>
<option value="VENTOUSE_PRIMAGE_VERIBOR">Ventouse primage VERIBOR</option>
<option value="MARQUEUR_PERMANANT_NOIR_STAEDTLER_F">Marqueur permanant Noir STAEDTLER F</option>
<option value="MARQUEUR_EDING_3000">Marqueur  Eding 3000</option>
<option value="RUBOND_IMPRIMENTE_MACHINE">Rubond Imprimente Machine</option>
<option value="SACHAIT_DES_GRAIN_ANTI_HUMIDIT">Sachait des grain anti humidité</option>
<option value="SCOTCH_TESA_50600_66X_25MM">Scotch tesa 50600 66x 25mm</option>
<option value="ROLLO_DE_FILM_PET_80UM_VERDE_66M_X_50MM">ROLLO DE FILM PET 80μm VERDE 66m x 50mm</option>
<option value="GABARIT_DE_CONTROLE_C41_PROFIL_3_COTES">GABARIT DE CONTROLE C41 PROFIL 3 COTES</option>
<option value="GABARIT_DE_MONTAGE_C41_PROFIL_3_COTES">GABARIT DE MONTAGE C41 PROFIL 3 COTES</option>
<option value="ROLL_10000_PERMANENT_SELF_ADHESIVE_70X13">ROLL 10000 PERMANENT SELF-ADHESIVE 70x13</option>
<option value="RUBON_3400_WAX_RESIN83MM_SUPL450M_C_25">RUBON 3400 WAX/RESIN83MM SUPL450M C-25MM</option>
<option value="GABARIT_PROFILE_SUP_RIEUR_SE216">Gabarit Profile supérieur SE216</option>
<option value="GABARIT_PROFILE_SUP_RIEUR_SE270_LABIO">Gabarit Profile supérieur SE270 / Labio</option>
<option value="GABARIT_PROFILE_SUP_RIEUR_SE270">Gabarit Profile supérieur SE270</option>
<option value="TIQUETTES_TRACABILITE_AUTOMATIQUE_PG4">étiquettes tracabilité automatique PG4</option>
<option value="ETIQUETTE_EN_VELIN_COLLE_S2046">ETIQUETTE EN VELIN,COLLE S2046</option>
<option value="CINTA_PLASTICA_BLANCA_66X50_TESA_4024">CINTA PLASTICA BLANCA 66X50 TESA 4024</option>
<option value="CAVALIERS_BLEU_RETOUR">Cavaliers bleu retour</option>
<option value="HOUSSING">houssing</option>
<option value="CAMER_C41_CVM">CAMER C41 CVM</option>
              </select>
              <select
                value={entry.problem}
                onChange={(e) => handleEntryChange(idx, 'problem', e.target.value)}
                className="p-2 border rounded"
              >
<option value="DECOLLAGE">DECOLLAGE</option>
<option value="POSITION">POSITION</option>
<option value="CASSE">CASSE</option>
<option value="TRIANGLE">TRIANGLE</option>
<option value="GAP">GAP</option>
<option value="ECAILLE">ECAILLE</option>
<option value="TRAJECTOIRE_PU">TRAJECTOIRE_PU</option>
<option value="ETAT_DES">ETAT_DES</option>
<option value="CONNECTEURS_C41_H">CONNECTEURS_C41_H</option>
<option value="BRILLANCE">BRILLANCE</option>
<option value="TACHE_PRIMAGE_ZV">TACHE_PRIMAGE_ZV</option>
<option value="RAYURE">RAYURE</option>
<option value="DEFAUT_INTERNE">DEFAUT_INTERNE</option>
<option value="GRIFFE">GRIFFE</option>
<option value="PRIMAGE_NOK">PRIMAGE_NOK</option>
<option value="RETRAIT_PVB">RETRAIT_PVB</option>
<option value="TEST">TEST</option>
<option value="REJET">REJET</option>
<option value="TIME_OUT">TIME_OUT</option>

              </select>
              <input
                type="number"
                min="0"
                placeholder="Qty"
                value={entry.Quantity}
                onChange={(e) => handleEntryChange(idx, 'Quantity', Number(e.target.value))}
                className="p-2 border rounded w-20"
              />
              <button
                type="button"
                onClick={() => removeWastedEntry(idx)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addWastedEntry}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Entry
          </button>
          {formError && <p className="text-red-600">{formError}</p>}
          <button
            type="submit"
            className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Submit Shift
          </button>
        </form>
      </section>

      {/* Graph Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Wasted Graph</h1>
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={filter.shiftType}
            onChange={(e) => setFilter((f) => ({ ...f, shiftType: e.target.value }))}
            className="p-2 border rounded"
          >
            <option value="ALL">All Shifts</option>
            <option value="MORNING">Morning</option>
            <option value="MIDDAY">Midday</option>
            <option value="NIGHT">Night</option>
          </select>
          <select
            value={filter.ligneType}
            onChange={(e) => setFilter((f) => ({ ...f, ligneType: e.target.value }))}
            className="p-2 border rounded"
          >
            <option value="ALL">All Lines</option>
            <option value="LIGNE1">Ligne 1</option>
            <option value="LIGNE2">Ligne 2</option>
          </select>
          <select
            value={filter.category}
            onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
            className="p-2 border rounded"
          >
            <option value="ALL">All parts</option>
            <option value="RAINSN_PLA_NONE_NO_NO_4M0845543">RAINSN.PLA.NONE.NO..NO.4M0845543</option>
<option value="RAS_OTH_NO_NO_NPL_P_XXX_01_00_00_0">RAS.OTH.NO..NO..NPL.P.XXX.01.00.00.0</option>
<option value="CAM_BRKT_SE270_WS_6F0_868_033_SE270_DRW">CAM.BRKT.SE270.WS.6F0_868_033_SE270_DRW_</option>
<option value="CAM_BRKT_SE216_WS_6F9_868_033_SE216_D">CAM.BRKT.SE216.WS.6F9_868_033____SE216_D</option>
<option value="RAS_OTH_NO_PUR_NPL_RS_HFEPH2">RAS.OTH.NO..PUR.NPL.RS_HFEPH2</option>
<option value="FRM_SOF_EPDM_EXTR_WS_UP_PROF_SE270">FRM.SOF.EPDM.EXTR.WS.UP.PROF.SE270</option>
<option value="FRM_SOF_EPDM_EXTR_WS_AEST_UP_PROF_SE270">FRM.SOF.EPDM.EXTR.WS.AEST.UP.PROF.SE270</option>
<option value="FRM_SOF_EPDM_ROLL_WS_LOW_PROF_SE270">FRM.SOF.EPDM.ROLL.WS.LOW.PROF.SE270</option>
<option value="PROFILE_SUPERIEUR_SE216">Pofile supérieur SE216</option>
<option value="LOWER_PROFIL_SE216_WITH_OPENING">Lower Profil SE216 with opening</option>
<option value="LOWER_PROFIL_VW216">Lower Profil VW216</option>
<option value="PROFILE_SUPERIEUR_VW216">Pofile supérieur VW216</option>
<option value="FRM_FLU_TPE_ROLL_WS_P2J0_SGS_201_2242">FRM.FLU.TPE.ROLL.WS.P2J0.SGS_201_2242</option>
<option value="SPACER_5X5_3X40_FRANCEM_EPDM_SE270">SPACER.5x5,3x40.FRANCEM.EPDM.SE270</option>
<option value="FRM_FLU_TPE_STRE_WS_VW276_DRAWING_040316">FRM.FLU.TPE.STRE.WS.VW276.DRAWING_040316</option>
<option value="HELLA_4_7_RSA_BRACKET_JFC_BJA_B10">HELLA 4.7 RSA BRACKET (JFC BJA B10)</option>
<option value="BLISTER_HELLA_4_7_RSA_NISSAN">BLISTER HELLA 4.7 RSA / Nissan</option>
<option value="AGRAFFE_PA66_C41_WS_EDGE_CLIP">AGRAFFE.PA66.C41.WS.EDGE.CLIP</option>
<option value="HALTEPLATTE_R_BAS_MKF_P_N_2GA868033">HALTEPLATTE.R.BAS.MKF.P/N.2GA868033</option>
<option value="CAMERA_PLATE_2GM_868_033_A">Camera plate 2GM 868 033 A</option>
<option value="BLISTER_RAIN_SENSOR_MB_PLASTIC">BLISTER RAIN SENSOR / MB (Plastic )</option>
<option value="NAVY_BLUE_PLASTIC_SPACER_26_6MM_BFC2">Navy blue plastic spacer 26.6mm BFC2</option>
<option value="CAM_BRKT_OTH_NO_NO_PLA_2GM_868_033_C_DR">CAM.BRKT.OTH.NO.NO.PLA.2GM_868_033_C_DRW</option>
<option value="HALTEPLATTE_R_BAS_MKF_P_N_2GA868033B">HALTEPLATTE.R.BAS.MKF.P/N.2GA868033B</option>
<option value="VICS_BRACKET_4N0_907_720">VICS bracket 4N0.907.720</option>
<option value="LOCATOR_PIN_P21_PLA_INJ">LOCATOR.PIN.P21.PLA.INJ.</option>
<option value="COVER_BRACKET_PA66GF30_WS_PSA_CP4">COVER.BRACKET.PA66GF30.WS.PSA.CP4</option>
<option value="CAB_X_OTH_WS_D_PP_N_2GM_868_033_D">CAB.X.OTH.WS.D.PP.N.2GM.868.033.D</option>
<option value="G_C41_WS_N_PA663_CITC41WSDEM_HY_OTH">G.C41.WS.N.PA663.CITC41WSDEM-HY.OTH</option>
<option value="OTH_G_VW276_WS_X_C_PBT_N_2GA_868_033_C">OTH.G.VW276.WS.X.C.PBT.N.2GA.868.033.C</option>
<option value="SPACER_VW_5_3_MMX5X20_MM">Spacer VW 5,3 mmx5x20 mm</option>
<option value="FRM_USH_TPE_CORN_WS_PSA_C_C41_01_00_00_0">FRM.USH.TPE.CORN.WS.PSA.C-C41-01-00-00-0</option>
<option value="FRM_FLU_TPE_STRE_WS_VW276_TAB_008_899_A">FRM.FLU.TPE.STRE.WS.VW276.TAB.008.899.A</option>
<option value="ACT_DUP_BETAWIPE_VP04604_1L">ACT. DUP. BETAWIPE - VP04604 1L</option>
<option value="PRIDUP_BETAPRIME_5404_1L">PRI.DUP.BETAPRIME-5404.1L</option>
<option value="PRILDUP_BETAPRIME_5500_1L">PRI.DUP.BETAPRIME-5500.1L</option>
<option value="PRIDUP_BETAPRIME_5550_1L">PRI.DUP.BETAPRIME-5550.1L</option>
<option value="PRI_DUP_BETAPRIME_5026_1L">PRI.DUP.BETAPRIME-5026.1L</option>
<option value="STILDUP_BETASEAL_1965_1F_300ML">STI.DUP.BETASEAL-1965-1F.300ML</option>
<option value="STI_DUP_BETASEAL_1965_1F_22L">STI.DUP.BETASEAL-1965-1F.22L</option>
<option value="JINETILLO_PASO_18">Jinetillo paso 18</option>
<option value="JINETILLO_PASO_21">Jinetillo paso 21</option>
<option value="BANDE_DE_BALISAGE">bande de balisage</option>
<option value="MARQUEUR_BLEU">Marqueur bleu</option>
<option value="CISEAUX_DE_CERCLAGE">Ciseaux de cerclage</option>
<option value="JINETILLO_MARRON_M_18_0A">Jinetillo Marrón M.18.0A</option>
<option value="JINETILLO_NARANJA_T_21_0A">Jinetillo naranja T.21.0A</option>
<option value="CREMALLI_RES_PASO_32_VW216">Crémallières paso 32 VW216</option>
<option value="CREMALLI_RE_C41_PASO_28_COLD_VERSION">Cremallière C41 paso 28 COLD version</option>
<option value="RAMETTE_PAPIER_A">ramette papier A6</option>
<option value="SERRE_TETE_POUR_ECRAN_FACIAL">SERRE TETE POUR ECRAN FACIAL</option>
<option value="ECRAN_ADAPTABLE_VISOR_BORD_METAL">ECRAN ADAPTABLE VISOR BORD METAL</option>
<option value="FIELTRO_C_BLANCO_DIAMETRE_10X20_MM">Fieltro c-blanco Diametre 10x20 mm</option>
<option value="FIELTRO_C_BLANCO_26X20X10_MM">Fieltro c-blanco 26x20x10 mm</option>
<option value="TETE_DE_BIBERON_26X20X10_MM">Tete de biberon 26x20x10 mm</option>
<option value="T_TE_DE_PRIMAGE_D10_MM">Tête de primage D10 mm</option>
<option value="T_TE_DE_PRIMAGE_D1_MODIFI">Tête de primage D16 modifié</option>
<option value="SCOTCH_HAUTE_TEMPERATURE">scotch haute température</option>
<option value="ETIQUETTE_BT5026">Etiquette BT5026</option>
<option value="ETIQUETTE_VP04604">Etiquette VP04604</option>
<option value="ETIQUETTE_BT5500">Etiquette BT5500</option>
<option value="SCOTCH_DOUBLE_FACE">Scotch double face</option>
<option value="ETIQUETTE_BC3300">Etiquette BC3300</option>
<option value="DRYING_BAG_10GR_ORANGE_SILICA_GEL_TYPE_0">DRYING BAG 10GR ORANGE SILICA GEL TYPE 0</option>
<option value="SOBRE_ADHESIVO_240_X_180_MM_TRANSPAREN">SOBRE ADHESIVO 240 X 180 MM. TRANSPARENT</option>
<option value="BOLSA_PE_TRANSP_MICROPER_1550_1500X1780">Bolsa PE transp microper 1550+1500x1780</option>
<option value="BIBERON_PRIMER_301_100">BIBERON  PRIMER  301.100</option>
<option value="LAMES_POUR_LIGNE_DE_CONTROLE">LAMES  POUR LIGNE DE CONTROLE</option>
<option value="JUEGO_CREMALLERA_REF_09441_ESPUMA_POLIE">Juego cremallera ref.09441 espuma polie.</option>
<option value="FIELTRE_D_16X20_MM">Fieltre D 16x20 mm</option>
<option value="FIELTRO_C_BLANCO_22X20_MM">Fieltro c-blanco 22x20 mm</option>
<option value="BAGUETTES_BOIS_POUR_RACK_CUSTODE">Baguettes bois pour Rack custode</option>
<option value="RAMETTE_PAPIER_A4">Ramette PAPIER A4</option>
<option value="CAMERA_VW216_INDICE_B">CAMERA VW216 INDICE B</option>
<option value="CAMERA_VW216_INDICE_C">CAMERA VW216 INDICE C</option>
<option value="CREMALLI_RES_18_SE270_SE216">Crémallières 18 se270/se216</option>
<option value="CREMALLI_RES_21_SE270_SE216">Crémallières 21 se270/se216</option>
<option value="HP_LASER_JET_PRO_M404DN_CF259A">HP LASER JET Pro M404DN CF259A</option>
<option value="AUTOCOLLANTS_SE216">Autocollants se216</option>
<option value="AUTOCOLLANTS_SE270">Autocollants se270</option>
<option value="CAVALIERS_C41_N28_0A_COLD_VERSION">Cavaliers C41 N28.0A cold Version</option>
<option value="CREMALLI_RE_C41_PASO_40_HEATED_VERSION">Cremallière C41 paso 40 Heated version</option>
<option value="CAVALIERS_C41_N40_0A_HEATED_VERSION">Cavaliers C41 N40.0A Heated Version</option>
<option value="CR_MALLI_RES_PASO_34_VW_SEAT">Crémallières paso 34 VW/SEAT</option>
<option value="CAVALIERS_C41_COLD">Cavaliers C41 cold</option>
<option value="CREMALLI_RES_PASO_32_VW276">Crémallières paso 32 VW276</option>
<option value="CREMALLI_RE_RACK_R006_90">Crémallière rack R006.90</option>
<option value="PAQUET_DE_100_SERRE_CABLE_EN_PLASTIQUE">Paquet de 100 serre cable en plastique</option>
<option value="CUBE_ADH_SIF_900_E_02493">Cube adhésif  900-E+02493</option>
<option value="GANTS_NITRIL_JETABLE_NON_POUDRE">Gants Nitril jetable non poudre</option>
<option value="BOAUILLAS_WS_XPA_PARA_FIELTRO_DE_D22X2">Boquillas WS (XPA) para fieltro de D22x2</option>
<option value="BOAUILLAS_WS_DLP_L_PARA_FIELTRO_DE_D16">Boquillas WS (DLP-L) para fieltro de D16</option>
<option value="WIPEOFF_BOBINE_IND_PURE_OUATE_150M">WIPEOFF BOBINE IND. pure ouate 150m</option>
<option value="CLE_DUPONT_BETACLEAN_3300_XXX">CLE.DUPONT.BETACLEAN 3300.XXX</option>
<option value="CRAYON_MARQUAGE_DES_DEFAUTS_STAEDTLER">Crayon marquage des défauts STAEDTLER</option>
<option value="TETE_DE_CLEANER">Tete de cleaner</option>
<option value="ETIQUETTE_BLANCHE_ETIKA_70MM_X_37MM">ETIQUETTE BLANCHE ETIKA 70mm X 37mm</option>
<option value="GANTS_ANTI_ACIDE">GANTS ANTI-ACIDE</option>
<option value="BANDE_DE_PROTECTION_VERRE">Bande de protection verre</option>
<option value="TABLIER_FOUR">Tablier Four</option>
<option value="VENTOUSE_PRIMAGE_VERIBOR">Ventouse primage VERIBOR</option>
<option value="MARQUEUR_PERMANANT_NOIR_STAEDTLER_F">Marqueur permanant Noir STAEDTLER F</option>
<option value="MARQUEUR_EDING_3000">Marqueur  Eding 3000</option>
<option value="RUBOND_IMPRIMENTE_MACHINE">Rubond Imprimente Machine</option>
<option value="SACHAIT_DES_GRAIN_ANTI_HUMIDIT">Sachait des grain anti humidité</option>
<option value="SCOTCH_TESA_50600_66X_25MM">Scotch tesa 50600 66x 25mm</option>
<option value="ROLLO_DE_FILM_PET_80UM_VERDE_66M_X_50MM">ROLLO DE FILM PET 80μm VERDE 66m x 50mm</option>
<option value="GABARIT_DE_CONTROLE_C41_PROFIL_3_COTES">GABARIT DE CONTROLE C41 PROFIL 3 COTES</option>
<option value="GABARIT_DE_MONTAGE_C41_PROFIL_3_COTES">GABARIT DE MONTAGE C41 PROFIL 3 COTES</option>
<option value="ROLL_10000_PERMANENT_SELF_ADHESIVE_70X13">ROLL 10000 PERMANENT SELF-ADHESIVE 70x13</option>
<option value="RUBON_3400_WAX_RESIN83MM_SUPL450M_C_25">RUBON 3400 WAX/RESIN83MM SUPL450M C-25MM</option>
<option value="GABARIT_PROFILE_SUP_RIEUR_SE216">Gabarit Profile supérieur SE216</option>
<option value="GABARIT_PROFILE_SUP_RIEUR_SE270_LABIO">Gabarit Profile supérieur SE270 / Labio</option>
<option value="GABARIT_PROFILE_SUP_RIEUR_SE270">Gabarit Profile supérieur SE270</option>
<option value="TIQUETTES_TRACABILITE_AUTOMATIQUE_PG4">étiquettes tracabilité automatique PG4</option>
<option value="ETIQUETTE_EN_VELIN_COLLE_S2046">ETIQUETTE EN VELIN,COLLE S2046</option>
<option value="CINTA_PLASTICA_BLANCA_66X50_TESA_4024">CINTA PLASTICA BLANCA 66X50 TESA 4024</option>
<option value="CAVALIERS_BLEU_RETOUR">Cavaliers bleu retour</option>
<option value="HOUSSING">houssing</option>
<option value="CAMER_C41_CVM">CAMER C41 CVM</option>
          </select>
          <select
            value={filter.problem}
            onChange={(e) => setFilter((f) => ({ ...f, problem: e.target.value }))}
            className="p-2 border rounded"
          >
            <option value="ALL">All Problems</option>
            <option value="DECOLLAGE">DECOLLAGE</option>
<option value="POSITION">POSITION</option>
<option value="CASSE">CASSE</option>
<option value="TRIANGLE">TRIANGLE</option>
<option value="GAP">GAP</option>
<option value="ECAILLE">ECAILLE</option>
<option value="TRAJECTOIRE_PU">TRAJECTOIRE_PU</option>
<option value="ETAT_DES">ETAT_DES</option>
<option value="CONNECTEURS_C41_H">CONNECTEURS_C41_H</option>
<option value="BRILLANCE">BRILLANCE</option>
<option value="TACHE_PRIMAGE_ZV">TACHE_PRIMAGE_ZV</option>
<option value="RAYURE">RAYURE</option>
<option value="DEFAUT_INTERNE">DEFAUT_INTERNE</option>
<option value="GRIFFE">GRIFFE</option>
<option value="PRIMAGE_NOK">PRIMAGE_NOK</option>
<option value="RETRAIT_PVB">RETRAIT_PVB</option>
<option value="TEST">TEST</option>
<option value="REJET">REJET</option>
<option value="TIME_OUT">TIME_OUT</option>

          </select>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter((f) => ({ ...f, startDate: e.target.value }))}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter((f) => ({ ...f, endDate: e.target.value }))}
            className="p-2 border rounded"
          />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="wasted" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* All Shifts Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">All Shifts</h1>
        {isLoading ? (
          <p>Loading shifts...</p>
        ) : (
          <div className="space-y-4">
            {shifts.map((s: Shift) => (
              <div key={s.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">
                      {s.shiftType} | {s.ligneType} | {formatDate(s.date)} | Tech: {s.technicien || '-'}
                    </p>
                    <p className="text-gray-700">
                      Total Wasted: <span className="font-bold">{s.totalWasted}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => deleteShift(s.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <ul className="mt-2 ml-4 list-disc text-gray-700">
                  {s.wastedEntries.map((we, i) => (
                    <li key={i}>
                      {we.category} - {we.problem}: {we.Quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ShiftPage;
